import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { DataSource, QueryFailedError, Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import {
  RegistrationContact,
  RegistrationContactChannel
} from "../../entities/registration-contact.entity";
import { RefreshTokenSession } from "../../entities/refresh-token-session.entity";
import { CreateUserDto } from "../users/dtos/create-user.dto";

/** Sliding inactivity window; token refresh and OTP resend must not reset it. */
const INACTIVITY_MS = 48 * 60 * 60 * 1000;
type ContactInput = { channel: RegistrationContactChannel; value: string };
type StateUser = Pick<User, "id" | "isSeller" | "registrationStatus" | "registrationExpiresAt">;

/** Coordinates pending account requirements, contact ownership, and mobile session issuance. */
@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(RegistrationContact)
    private readonly contacts: Repository<RegistrationContact>,
    @InjectRepository(RefreshTokenSession)
    private readonly refreshSessions: Repository<RefreshTokenSession>,
    private readonly dataSource: DataSource,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  /** Advisory lookup only: registration submission and OTP confirmation recheck ownership. */
  async contactAvailability(channel: RegistrationContactChannel, value: string) {
    const contact = this.validatedContact(channel, value);
    const { unavailable } = await this.contactOwnership(contact, this.contacts, this.users);
    return { available: !unavailable };
  }

  /** Keeps submitted contacts as claims until OTP proves ownership. */
  async start(dto: CreateUserDto) {
    await this.expirePendingRegistrations();
    const email = dto.email?.trim().toLowerCase() || null;
    const phone = dto.phone?.trim() || null;
    if (dto.isSeller ? !email || !phone : !email && !phone) {
      throw new BadRequestException("Provide the contact details required for this account type");
    }
    const now = new Date();
    const hash = await bcrypt.hash(dto.password, 10);
    const createPendingRegistration = () =>
      this.dataSource.transaction(async manager => {
        const repo = manager.getRepository(User);
        const contactRepo = manager.getRepository(RegistrationContact);
        const candidates: { contact: ContactInput; owner: RegistrationContact | null }[] = [];
        const fieldErrors: Partial<Record<RegistrationContactChannel, string[]>> = {};
        // Check every supplied contact before saving a user, even if blur checks were skipped.
        for (const input of this.inputContacts(email, phone)) {
          const contact = this.validatedContact(input.channel, input.value);
          const { owner, unavailable } = await this.contactOwnership(
            contact,
            contactRepo,
            repo,
            true
          );
          if (unavailable) {
            fieldErrors[contact.channel] = ["This contact is already linked to another account."];
          }
          candidates.push({ contact, owner });
        }
        if (Object.keys(fieldErrors).length) {
          throw new ConflictException({
            code: "CONTACT_ALREADY_IN_USE",
            message: "Update the contacts that are already linked to another account.",
            fieldErrors
          });
        }
        const created = await repo.save(
          repo.create({
            firstName: dto.firstName,
            password: hash,
            phone: null,
            email: null,
            isPhoneValidated: false,
            isEmailValidated: false,
            isSeller: !!dto.isSeller,
            registrationStatus: "PENDING_VERIFICATION",
            lastMeaningfulActivityAt: now,
            registrationExpiresAt: new Date(now.getTime() + INACTIVITY_MS)
          })
        );
        for (const { contact, owner } of candidates) {
          const normalizedValue = this.normalize(contact);
          await contactRepo.save(
            contactRepo.create({
              userId: created.id,
              channel: contact.channel,
              value: contact.value,
              normalizedValue,
              isOwner: !owner,
              isVerified: false
            })
          );
        }
        return created;
      });
    let user: User;
    try {
      user = await createPendingRegistration();
    } catch (error) {
      // A simultaneous signup can claim a previously empty slot; retry after its transaction.
      const details =
        error instanceof QueryFailedError
          ? (error.driverError as { code?: string; constraint?: string })
          : null;
      if (
        details?.code !== "23505" ||
        details.constraint !== "registration_contacts_one_owner_idx"
      ) {
        throw error;
      }
      user = await createPendingRegistration();
    }
    return {
      message: "A pending registration session has been created.",
      ...(await this.session(user))
    };
  }

  /** Registration updates reuse refresh tokens; login and refresh issue a new token ID. */
  async session(user: StateUser, issueRefreshToken = true) {
    const userRow = await this.users.findOneBy({ id: user.id });
    if (!userRow) throw new NotFoundException("Registration not found");
    if (
      userRow.registrationStatus === "EXPIRED" ||
      (userRow.registrationStatus === "PENDING_VERIFICATION" && this.isExpired(userRow))
    ) {
      return { userId: user.id, registrationState: await this.state(user.id) };
    }
    const accessToken = await this.jwt.signAsync(
      {
        userId: user.id,
        tokenType: userRow.registrationStatus === "ACTIVE" ? "access" : "registration",
        identityWay: userRow.isEmailValidated ? "email" : "phone",
        tokenVersion: userRow.tokenVersion
      },
      {
        secret: this.config.getOrThrow<string>("JWT_SECRET"),
        expiresIn: this.config.get<string>("JWT_ACCESS_TOKEN_TTL", "15m")
      }
    );
    let refreshToken: string | undefined;
    if (issueRefreshToken) {
      const tokenId = randomUUID();
      const ttl = this.config.get<string>("JWT_REFRESH_TOKEN_TTL", "30d");
      refreshToken = await this.jwt.signAsync(
        {
          userId: user.id,
          tokenType: "refresh",
          identityWay: userRow.isEmailValidated ? "email" : "phone",
          tokenVersion: userRow.tokenVersion,
          tokenId
        },
        { secret: this.config.getOrThrow<string>("JWT_SECRET"), expiresIn: ttl }
      );
      await this.refreshSessions.save(
        this.refreshSessions.create({
          userId: user.id,
          tokenId,
          expiresAt: new Date(Date.now() + this.durationMs(ttl))
        })
      );
    }
    return {
      userId: user.id,
      accessToken,
      refreshToken,
      registrationState: await this.state(user.id)
    };
  }

  /** Consumes the old token ID once, preventing concurrent reuse of a refresh token. */
  async rotateRefreshSession(userId: string, tokenId: string) {
    const deleted = await this.refreshSessions.delete({ userId, tokenId });
    if (!deleted.affected)
      throw new UnauthorizedException("Refresh token has already been used or revoked");
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException("Session expired");
    return this.session(user);
  }

  /** Logout revokes persisted refresh sessions and invalidates versioned access tokens. */
  async revokeSessions(userId: string) {
    await this.dataSource.transaction(async manager => {
      await manager.getRepository(RefreshTokenSession).delete({ userId });
      await manager.getRepository(User).increment({ id: userId }, "tokenVersion", 1);
    });
  }

  /** Returns masked destinations and distinguishes lost claims from intentional removals. */
  async state(userId: string) {
    let user = await this.users.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("Registration not found");
    if (user.registrationStatus === "PENDING_VERIFICATION" && this.isExpired(user)) {
      await this.dataSource.transaction(async manager => {
        await manager
          .getRepository(User)
          .createQueryBuilder()
          .update(User)
          .set({ registrationStatus: "EXPIRED", tokenVersion: () => '"tokenVersion" + 1' })
          .where('"id" = :userId AND "registrationStatus" = :pending', {
            userId,
            pending: "PENDING_VERIFICATION"
          })
          .execute();
        await manager.getRepository(RegistrationContact).update({ userId }, { isOwner: false });
        await manager.getRepository(RefreshTokenSession).delete({ userId });
      });
      user = { ...user, registrationStatus: "EXPIRED", tokenVersion: user.tokenVersion + 1 };
    }
    const contacts = await this.contacts.find({ where: { userId }, order: { createdAt: "DESC" } });
    const stateFor = (channel: RegistrationContactChannel) => {
      const contact = contacts.find(item => item.channel === channel && !item.isRemoved);
      if (!contact || contact.isTransferred) return "MISSING";
      return contact.isVerified && contact.isOwner ? "VERIFIED" : "PENDING";
    };
    const email = stateFor("email");
    const phone = stateFor("phone");
    const latestContact = (channel: RegistrationContactChannel) =>
      contacts.find(item => item.channel === channel && !item.isRemoved && !item.isTransferred);
    const removedContactChannels = contacts.filter(c => c.isRemoved).map(c => c.channel);
    const requiredContactChannels = user.isSeller
      ? ["email", "phone"]
      : (["email", "phone"] as const).filter(channel => {
          const latest = contacts.find(contact => contact.channel === channel);
          return !!latest && !latest.isRemoved;
        });
    const active = user.registrationStatus === "ACTIVE";
    const buyerHasVerifiedContact = email === "VERIFIED" || phone === "VERIFIED";
    const buyerHasUnresolvedRequiredContact = requiredContactChannels.some(channel =>
      channel === "email" ? email !== "VERIFIED" : phone !== "VERIFIED"
    );
    const nextAction =
      user.registrationStatus === "EXPIRED"
        ? "REGISTRATION_EXPIRED"
        : active
          ? "REGISTRATION_COMPLETE"
          : user.isSeller
            ? email === "MISSING" || phone === "MISSING"
              ? "ADD_CONTACT"
              : email !== "VERIFIED"
                ? "VERIFY_EMAIL"
                : phone !== "VERIFIED"
                  ? "VERIFY_PHONE"
                  : "REGISTRATION_COMPLETE"
            : buyerHasVerifiedContact && buyerHasUnresolvedRequiredContact
              ? "REMOVE_UNVERIFIED_CONTACT"
              : requiredContactChannels.length === 0
                ? "ADD_CONTACT"
                : email === "PENDING"
                  ? "VERIFY_EMAIL"
                  : phone === "PENDING"
                    ? "VERIFY_PHONE"
                    : email === "VERIFIED" || phone === "VERIFIED"
                      ? "REGISTRATION_COMPLETE"
                      : "ADD_CONTACT";
    return {
      accountStatus: user.registrationStatus,
      accountType: user.isSeller ? "seller" : "buyer",
      contacts: { email, phone },
      contactHints: {
        email: email === "MISSING" ? null : this.maskEmail(latestContact("email")?.value),
        phone: phone === "MISSING" ? null : this.maskPhone(latestContact("phone")?.value)
      },
      requiredContactChannels,
      removedContactChannels: [...new Set(removedContactChannels)],
      nextAction,
      expiresAt: active ? null : user.registrationExpiresAt
    };
  }

  /** Reads the current destination without extending the registration deadline. */
  async sendChallenge(userId: string, channel: RegistrationContactChannel) {
    const user = await this.getPending(userId);
    const contacts = await this.contacts.find({
      where: { userId, channel, isRemoved: false },
      order: { createdAt: "DESC" }
    });
    const contact = contacts[0];
    if (!contact || contact.isTransferred)
      throw new BadRequestException("Unable to process verification request");
    return { user, contact };
  }

  /** Called after OTP validation; transfers eligible claims under database locks. */
  async verify(userId: string, channel: RegistrationContactChannel) {
    const { contact } = await this.sendChallenge(userId, channel);
    const normalizedValue = contact.normalizedValue;
    await this.dataSource.transaction(async manager => {
      const userRepo = manager.getRepository(User);
      const contactRepo = manager.getRepository(RegistrationContact);
      const user = await userRepo.findOne({
        where: { id: userId },
        lock: { mode: "pessimistic_write" }
      });
      if (!user || user.registrationStatus !== "PENDING_VERIFICATION" || this.isExpired(user)) {
        throw new UnauthorizedException("Registration session expired");
      }
      const claim = await contactRepo.findOne({
        where: { userId, channel, normalizedValue, isRemoved: false },
        lock: { mode: "pessimistic_write" }
      });
      if (!claim) throw new BadRequestException("Unable to process verification request");
      const owner = await contactRepo.findOne({
        where: { channel, normalizedValue, isOwner: true, isRemoved: false },
        lock: { mode: "pessimistic_write" }
      });
      if (owner && owner.userId !== userId) {
        const ownerUser = await userRepo.findOneBy({ id: owner.userId });
        if (
          !ownerUser ||
          ownerUser.registrationStatus !== "PENDING_VERIFICATION" ||
          owner.isVerified
        ) {
          claim.isRemoved = true;
          claim.isOwner = false;
          await contactRepo.save(claim);
          return;
        }
        owner.isOwner = false;
        owner.isTransferred = true;
        await contactRepo.save(owner);
      }
      claim.isOwner = true;
      claim.isVerified = true;
      claim.isTransferred = false;
      await contactRepo.save(claim);
      user.lastMeaningfulActivityAt = new Date();
      user.registrationExpiresAt = new Date(Date.now() + INACTIVITY_MS);
      await userRepo.save(user);
      await this.activateIfComplete(manager, user);
    });
    return this.session({ id: userId } as StateUser, false);
  }

  /** Adds a replacement candidate; it still needs its own OTP before activation. */
  async addContact(userId: string, channel: RegistrationContactChannel, value: string) {
    const user = await this.getPending(userId);
    value = channel === "email" ? value.trim().toLowerCase() : value.trim();
    const validValue =
      channel === "email"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        : /^\+\d{10,15}$/.test(value.trim());
    if (!validValue)
      throw new BadRequestException("Provide a valid email or international phone number");
    const normalizedValue = this.normalize({ channel, value });
    const duplicate = await this.contacts.findOne({ where: { userId, channel, normalizedValue } });
    if (duplicate && !duplicate.isRemoved)
      throw new BadRequestException("Unable to process contact update");
    const existingOwner = await this.contacts.findOne({
      where: { channel, normalizedValue, isOwner: true, isRemoved: false }
    });
    if (duplicate) {
      duplicate.value = value;
      duplicate.isRemoved = false;
      duplicate.isVerified = false;
      duplicate.isOwner = !existingOwner;
      await this.contacts.save(duplicate);
    } else {
      await this.contacts.save(
        this.contacts.create({ userId, channel, value, normalizedValue, isOwner: !existingOwner })
      );
    }
    await this.recordProgress(user.id);
    return this.session(user, false);
  }

  /** Buyers can drop an unverified channel only while another contact remains. */
  async removeContact(userId: string, channel: RegistrationContactChannel) {
    const user = await this.getPending(userId);
    if (user.isSeller) throw new BadRequestException("Seller contacts are required");
    const records = await this.contacts.find({
      where: { userId, isRemoved: false },
      order: { createdAt: "DESC" }
    });
    const target = records.find(item => item.channel === channel);
    const currentChannels = [...new Set(records.map(item => item.channel))];
    if (!target || target.isVerified || currentChannels.length <= 1) {
      throw new BadRequestException(
        "An unverified contact can only be removed when another contact remains"
      );
    }
    target.isRemoved = true;
    target.isOwner = false;
    await this.contacts.save(target);
    await this.recordProgress(user.id);
    await this.dataSource.transaction(manager => this.activateIfComplete(manager, user));
    return this.session(user, false);
  }

  /** Releases expired claims and refresh sessions without deleting account history. */
  async expirePendingRegistrations() {
    await this.dataSource.transaction(async manager => {
      const expired = await manager
        .getRepository(User)
        .createQueryBuilder()
        .update(User)
        .set({ registrationStatus: "EXPIRED", tokenVersion: () => '"tokenVersion" + 1' })
        .where('"registrationStatus" = :status AND "registrationExpiresAt" <= :now', {
          status: "PENDING_VERIFICATION",
          now: new Date()
        })
        .returning("id")
        .execute();
      const ids = (expired.raw as Array<{ id: string }>).map(row => row.id);
      if (ids.length) {
        await manager
          .getRepository(RegistrationContact)
          .createQueryBuilder()
          .update(RegistrationContact)
          .set({ isOwner: false })
          .where('"user_id" IN (:...ids)', { ids })
          .execute();
        await manager
          .getRepository(RefreshTokenSession)
          .createQueryBuilder()
          .delete()
          .where('"user_id" IN (:...ids)', { ids })
          .execute();
      }
    });
  }

  /** Buyer requirements allow explicit removals; sellers always need both verified slots. */
  private async activateIfComplete(manager: import("typeorm").EntityManager, user: User) {
    const repo = manager.getRepository(RegistrationContact);
    const contacts = await repo.find({ where: { userId: user.id }, order: { createdAt: "DESC" } });
    const currentByChannel = new Map<RegistrationContactChannel, RegistrationContact | null>();
    for (const channel of ["email", "phone"] as const) {
      const latest = contacts.find(c => c.channel === channel);
      currentByChannel.set(channel, latest && !latest.isRemoved ? latest : null);
    }
    const email = currentByChannel.get("email");
    const phone = currentByChannel.get("phone");
    const required = user.isSeller
      ? (["email", "phone"] as const)
      : (["email", "phone"] as const).filter(channel => contacts.some(c => c.channel === channel));
    const complete =
      required.length > 0 &&
      required.every(channel => {
        const contact = currentByChannel.get(channel);
        // Only buyers may intentionally remove a slot; missing seller contacts block activation.
        return contact ? contact.isOwner && contact.isVerified : !user.isSeller;
      });
    const hasVerifiedContact =
      !!(email?.isOwner && email.isVerified) || !!(phone?.isOwner && phone.isVerified);
    if (!complete || (!user.isSeller && !hasVerifiedContact)) return;
    user.email = email?.isOwner && email.isVerified ? email.value : null;
    user.phone = phone?.isOwner && phone.isVerified ? phone.value : null;
    user.isEmailValidated = !!(email?.isOwner && email.isVerified);
    user.isPhoneValidated = !!(phone?.isOwner && phone.isVerified);
    user.registrationStatus = "ACTIVE";
    user.registrationExpiresAt = null;
    for (const contact of contacts) {
      if (contact.isOwner && contact !== email && contact !== phone) {
        contact.isOwner = false;
        contact.isTransferred = true;
        await repo.save(contact);
      }
    }
    await manager.getRepository(User).save(user);
  }

  private async getPending(userId: string) {
    const user = await this.getPendingOrActive(userId);
    if (user.registrationStatus !== "PENDING_VERIFICATION")
      throw new UnauthorizedException("Registration is not pending");
    if (this.isExpired(user)) {
      await this.dataSource.transaction(async manager => {
        await manager
          .getRepository(User)
          .update(user.id, { registrationStatus: "EXPIRED", tokenVersion: user.tokenVersion + 1 });
        await manager.getRepository(RegistrationContact).update({ userId }, { isOwner: false });
        await manager.getRepository(RefreshTokenSession).delete({ userId });
      });
      throw new UnauthorizedException("Registration session expired");
    }
    return user;
  }

  private async getPendingOrActive(userId: string) {
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException("Registration session expired");
    return user;
  }

  private isExpired(user: User) {
    return !!user.registrationExpiresAt && user.registrationExpiresAt.getTime() <= Date.now();
  }

  /** Only successful, meaningful registration changes renew the 48-hour window. */
  private async recordProgress(userId: string) {
    const now = new Date();
    await this.users.update(userId, {
      lastMeaningfulActivityAt: now,
      registrationExpiresAt: new Date(now.getTime() + INACTIVITY_MS)
    });
  }

  private inputContacts(email: string | null, phone: string | null): ContactInput[] {
    return [
      ...(email ? [{ channel: "email" as const, value: email }] : []),
      ...(phone ? [{ channel: "phone" as const, value: phone }] : [])
    ];
  }

  private normalize(contact: ContactInput) {
    return contact.channel === "email"
      ? contact.value.trim().toLowerCase()
      : contact.value.replace(/[\s()-]/g, "");
  }

  private validatedContact(channel: RegistrationContactChannel, value: string): ContactInput {
    if (channel !== "email" && channel !== "phone") {
      throw new BadRequestException("Choose email or phone");
    }
    const normalized = this.normalize({ channel, value });
    const valid =
      channel === "email"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
        : /^\+[1-9]\d{9,14}$/.test(normalized);
    if (!valid || normalized.length > 320) {
      throw new BadRequestException("Provide a valid email or international phone number");
    }
    return { channel, value: normalized };
  }

  /** Unverified pending claims remain usable; verified contacts and active profiles stay protected. */
  private async contactOwnership(
    contact: ContactInput,
    contactRepo: Repository<RegistrationContact>,
    userRepo: Repository<User>,
    lock = false
  ) {
    const owner = await contactRepo.findOne({
      where: {
        channel: contact.channel,
        normalizedValue: this.normalize(contact),
        isOwner: true,
        isRemoved: false
      },
      ...(lock ? { lock: { mode: "pessimistic_write" as const } } : {})
    });
    if (!owner) return { owner: null, unavailable: false };
    const user = await userRepo.findOneBy({ id: owner.userId });
    const expired =
      !user ||
      user.registrationStatus === "EXPIRED" ||
      (user.registrationStatus === "PENDING_VERIFICATION" && this.isExpired(user));
    return {
      owner,
      unavailable: !expired && (owner.isVerified || user.registrationStatus === "ACTIVE")
    };
  }

  private maskEmail(value?: string) {
    if (!value) return null;
    const [name, domain] = value.split("@");
    return `${name.slice(0, 1)}***@${domain}`;
  }

  private maskPhone(value?: string) {
    if (!value) return null;
    return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
  }

  private durationMs(ttl: string) {
    // JWT accepts uppercase units too, including the project's existing `1D` setting.
    const match = ttl
      .trim()
      .toLowerCase()
      .match(/^(\d+)([smhd])$/);
    if (!match) throw new BadRequestException("JWT_REFRESH_TOKEN_TTL must use s, m, h, or d units");
    const amount = Number(match[1]);
    const unit = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[
      match[2] as "s" | "m" | "h" | "d"
    ];
    return amount * unit;
  }
}
