/** Isolates persistence and time to verify registration rules, expiry, and token rotation. */
import { BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "../../entities/user.entity";
import { RegistrationContact } from "../../entities/registration-contact.entity";
import { RefreshTokenSession } from "../../entities/refresh-token-session.entity";
import { RegistrationService } from "./registration.service";

jest.mock("bcrypt");
const hashPassword = bcrypt.hash as unknown as jest.Mock<Promise<string>, [string, number]>;

const NOW = new Date("2026-10-23T12:00:00.000Z");
const INACTIVITY_MS = 48 * 60 * 60 * 1000;

/** Entity fixtures keep each test independent while using the real service transitions. */
const makeUser = (overrides: Partial<User> = {}) =>
  Object.assign(new User(), {
    id: "user-1",
    isSeller: false,
    registrationStatus: "PENDING_VERIFICATION" as const,
    registrationExpiresAt: new Date(NOW.getTime() + INACTIVITY_MS),
    lastMeaningfulActivityAt: NOW,
    tokenVersion: 0,
    ...overrides
  });

const makeContact = (overrides: Partial<RegistrationContact> = {}) =>
  Object.assign(new RegistrationContact(), {
    id: "email-claim",
    userId: "user-1",
    channel: "email" as const,
    value: "ada@example.com",
    normalizedValue: "ada@example.com",
    isOwner: true,
    isRemoved: false,
    isVerified: false,
    isTransferred: false,
    ...overrides
  });

describe("RegistrationService state contract", () => {
  let pendingUser: User;
  let users: {
    findOneBy: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    createQueryBuilder: jest.Mock;
    create: jest.Mock;
  };
  let contacts: {
    find: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    create: jest.Mock;
  };
  let refreshSessions: {
    delete: jest.Mock;
    create: jest.Mock;
    save: jest.Mock<Promise<unknown>, [Partial<RefreshTokenSession>]>;
  };
  let jwt: { signAsync: jest.Mock };
  let config: { get: jest.Mock; getOrThrow: jest.Mock };
  let service: RegistrationService;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    hashPassword.mockResolvedValue("hashed-password");
    pendingUser = makeUser();
    const updateBuilder = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ raw: [] })
    };
    users = {
      findOneBy: jest.fn().mockResolvedValue(pendingUser),
      findOne: jest.fn().mockResolvedValue(pendingUser),
      save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn().mockReturnValue(updateBuilder),
      create: jest
        .fn()
        .mockImplementation((value: Partial<User>) => Object.assign(pendingUser, value))
    };
    contacts = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest
        .fn()
        .mockImplementation((contact: RegistrationContact) => Promise.resolve(contact)),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      create: jest
        .fn()
        .mockImplementation((value: Partial<RegistrationContact>) => makeContact(value))
    };
    refreshSessions = {
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      create: jest.fn().mockImplementation((value: Partial<RefreshTokenSession>) => value),
      save: jest.fn<Promise<unknown>, [Partial<RefreshTokenSession>]>().mockResolvedValue({})
    };
    const manager = {
      getRepository: jest.fn().mockImplementation((entity: unknown) => {
        if (entity === User) return users;
        if (entity === RegistrationContact) return contacts;
        if (entity === RefreshTokenSession) return refreshSessions;
        throw new Error("Unexpected entity in test transaction");
      })
    };
    const dataSource = {
      transaction: jest
        .fn()
        .mockImplementation((work: (entityManager: typeof manager) => Promise<unknown>) =>
          work(manager)
        )
    };
    jwt = { signAsync: jest.fn().mockResolvedValue("signed-token") };
    config = {
      get: jest.fn().mockImplementation((_key: string, fallback: string) => fallback),
      getOrThrow: jest.fn().mockReturnValue("test-secret")
    };
    service = new RegistrationService(
      users as never,
      contacts as never,
      refreshSessions as never,
      dataSource as never,
      jwt as never,
      config as never
    );
  });

  afterEach(() => jest.useRealTimers());

  it("reports a verified contact as unavailable without creating an account or session", async () => {
    contacts.findOne.mockResolvedValue(makeContact({ isVerified: true }));

    await expect(service.contactAvailability("email", " ADA@EXAMPLE.COM ")).resolves.toEqual({
      available: false
    });

    expect(contacts.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ normalizedValue: "ada@example.com" }) as unknown
      })
    );
    expect(users.create).not.toHaveBeenCalled();
    expect(users.save).not.toHaveBeenCalled();
    expect(refreshSessions.save).not.toHaveBeenCalled();
  });

  it("does not block an unverified claim in another pending registration", async () => {
    contacts.findOne.mockResolvedValue(makeContact({ userId: "other-pending-user" }));

    await expect(service.contactAvailability("email", "ada@example.com")).resolves.toEqual({
      available: true
    });
  });

  it("does not treat an expired pending claim as a permanent conflict", async () => {
    contacts.findOne.mockResolvedValue(makeContact({ isVerified: true }));
    pendingUser.registrationExpiresAt = NOW;

    await expect(service.contactAvailability("email", "ada@example.com")).resolves.toEqual({
      available: true
    });
  });

  it("validates and normalizes phone availability requests without reserving the contact", async () => {
    await expect(service.contactAvailability("phone", "+39 (000) 000-0001")).resolves.toEqual({
      available: true
    });
    expect(contacts.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ normalizedValue: "+390000000001" }) as unknown
      })
    );
    expect(contacts.save).not.toHaveBeenCalled();
    await expect(service.contactAvailability("email", "invalid-email")).rejects.toThrow(
      BadRequestException
    );
  });

  it("rejects all conflicting fields at final submission before creating a user", async () => {
    contacts.findOne.mockResolvedValue(makeContact({ isVerified: true }));

    const attempt = service.start({
      firstName: "Ada",
      email: "ada@example.com",
      phone: "+390000000001",
      password: "secret1"
    });
    await expect(attempt).rejects.toBeInstanceOf(ConflictException);
    await expect(attempt).rejects.toMatchObject({
      response: {
        code: "CONTACT_ALREADY_IN_USE",
        fieldErrors: {
          email: ["This contact is already linked to another account."],
          phone: ["This contact is already linked to another account."]
        }
      }
    });
    expect(users.create).not.toHaveBeenCalled();
    expect(users.save).not.toHaveBeenCalled();
    expect(contacts.save).not.toHaveBeenCalled();
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it("rechecks on submission when a previously available contact becomes verified", async () => {
    await expect(service.contactAvailability("email", "ada@example.com")).resolves.toEqual({
      available: true
    });
    contacts.findOne.mockResolvedValue(makeContact({ isVerified: true }));

    await expect(
      service.start({ firstName: "Ada", email: "ada@example.com", password: "secret1" })
    ).rejects.toThrow(ConflictException);
    expect(users.save).not.toHaveBeenCalled();
  });

  it("creates a pending session without any preliminary availability request", async () => {
    const result = await service.start({
      firstName: "Ada",
      email: "ada@example.com",
      password: "secret1"
    });

    expect(users.save).toHaveBeenCalledWith(
      expect.objectContaining({ registrationStatus: "PENDING_VERIFICATION" })
    );
    expect(contacts.save).toHaveBeenCalledWith(
      expect.objectContaining({ value: "ada@example.com", isVerified: false })
    );
    expect(result).toMatchObject({
      userId: pendingUser.id,
      accessToken: "signed-token",
      refreshToken: "signed-token"
    });
  });

  it("accepts a pending claim without taking ownership before its OTP is verified", async () => {
    contacts.findOne.mockResolvedValue(makeContact({ userId: "other-pending-user" }));

    await service.start({ firstName: "Ada", email: "ada@example.com", password: "secret1" });

    expect(contacts.save).toHaveBeenCalledWith(
      expect.objectContaining({ isOwner: false, isVerified: false })
    );
  });

  it("accepts the existing uppercase 1D refresh TTL and persists a matching session expiry", async () => {
    config.get.mockImplementation((key: string, fallback: string) =>
      key === "JWT_REFRESH_TOKEN_TTL" ? "1D" : fallback
    );

    await service.session(pendingUser);

    expect(refreshSessions.save.mock.calls[0][0].expiresAt).toEqual(
      new Date(NOW.getTime() + 86_400_000)
    );
  });

  it("requires both contact slots for a seller and marks absent claims as missing", async () => {
    users.findOneBy.mockResolvedValue({ ...pendingUser, isSeller: true });
    await expect(service.state("user-1")).resolves.toMatchObject({
      accountStatus: "PENDING_VERIFICATION",
      accountType: "seller",
      contacts: { email: "MISSING", phone: "MISSING" },
      requiredContactChannels: ["email", "phone"],
      nextAction: "ADD_CONTACT"
    });
  });

  it("reports the next buyer verification step and masks destinations", async () => {
    contacts.find.mockResolvedValue([
      {
        channel: "email",
        value: "ada@example.com",
        isOwner: true,
        isRemoved: false,
        isVerified: false,
        isTransferred: false
      },
      {
        channel: "phone",
        value: "+390000000001",
        isOwner: true,
        isRemoved: false,
        isVerified: false,
        isTransferred: false
      }
    ]);
    const state = await service.state("user-1");
    expect(state).toMatchObject({
      contacts: { email: "PENDING", phone: "PENDING" },
      contactHints: { email: "a***@example.com", phone: "*********0001" },
      requiredContactChannels: ["email", "phone"],
      nextAction: "VERIFY_EMAIL"
    });
    expect(JSON.stringify(state)).not.toContain("ada@example.com");
  });

  it("distinguishes a transferred claim from a pending candidate", async () => {
    contacts.find.mockResolvedValue([
      {
        channel: "email",
        value: "ada@example.com",
        isOwner: false,
        isRemoved: false,
        isVerified: false,
        isTransferred: true
      }
    ]);
    await expect(service.state("user-1")).resolves.toMatchObject({
      contacts: { email: "MISSING", phone: "MISSING" },
      requiredContactChannels: ["email"],
      nextAction: "ADD_CONTACT",
      contactHints: { email: null, phone: null }
    });
  });

  it("keeps a buyer pending when another supplied contact still needs verification", async () => {
    contacts.find.mockResolvedValue([
      makeContact({ isVerified: true }),
      makeContact({ id: "phone-claim", channel: "phone", value: "+390000000001" })
    ]);

    await expect(service.state(pendingUser.id)).resolves.toMatchObject({
      accountStatus: "PENDING_VERIFICATION",
      requiredContactChannels: ["email", "phone"],
      nextAction: "REMOVE_UNVERIFIED_CONTACT"
    });
  });

  it("rejects removal of the buyer's last contact", async () => {
    contacts.find.mockResolvedValue([makeContact()]);

    await expect(service.removeContact(pendingUser.id, "email")).rejects.toThrow(
      BadRequestException
    );
    expect(contacts.save).not.toHaveBeenCalled();
    expect(users.update).not.toHaveBeenCalled();
  });

  it("rejects removal of any required seller contact", async () => {
    pendingUser.isSeller = true;

    await expect(service.removeContact(pendingUser.id, "phone")).rejects.toThrow(
      "Seller contacts are required"
    );
    expect(contacts.save).not.toHaveBeenCalled();
  });

  it("activates a buyer after removing an unverified contact when the other is verified", async () => {
    const email = makeContact({ isVerified: true });
    const phone = makeContact({ id: "phone-claim", channel: "phone", value: "+390000000001" });
    contacts.find.mockResolvedValue([email, phone]);

    const response = await service.removeContact(pendingUser.id, "phone");

    expect(phone).toMatchObject({ isRemoved: true, isOwner: false });
    expect(pendingUser).toMatchObject({
      registrationStatus: "ACTIVE",
      email: "ada@example.com",
      phone: null,
      registrationExpiresAt: null
    });
    expect(response.registrationState).toMatchObject({
      accountStatus: "ACTIVE",
      contacts: { email: "VERIFIED", phone: "MISSING" },
      removedContactChannels: ["phone"],
      nextAction: "REGISTRATION_COMPLETE"
    });
    expect(refreshSessions.save).not.toHaveBeenCalled();
  });

  it("renews the inactivity deadline after removing an optional contact but stays pending", async () => {
    contacts.find.mockResolvedValue([
      makeContact(),
      makeContact({ id: "phone-claim", channel: "phone" })
    ]);

    const response = await service.removeContact(pendingUser.id, "phone");

    expect(users.update).toHaveBeenCalledWith(pendingUser.id, {
      lastMeaningfulActivityAt: NOW,
      registrationExpiresAt: new Date(NOW.getTime() + INACTIVITY_MS)
    });
    expect(response.registrationState.accountStatus).toBe("PENDING_VERIFICATION");
  });

  it("does not activate a seller when the other required contact is missing", async () => {
    pendingUser.isSeller = true;
    const phone = makeContact({ channel: "phone", value: "+390000000001" });
    contacts.find.mockResolvedValue([phone]);
    contacts.findOne.mockResolvedValue(phone);

    const response = await service.verify(pendingUser.id, "phone");

    expect(phone.isVerified).toBe(true);
    expect(response.registrationState.accountStatus).toBe("PENDING_VERIFICATION");
    expect(pendingUser.registrationStatus).toBe("PENDING_VERIFICATION");
  });

  it("activates a seller only when both current contacts are verified", async () => {
    pendingUser.isSeller = true;
    const email = makeContact({ isVerified: true });
    const phone = makeContact({ channel: "phone", value: "+390000000001" });
    contacts.find.mockImplementation((options: { where: { channel?: string } }) =>
      Promise.resolve(options.where.channel === "phone" ? [phone] : [email, phone])
    );
    contacts.findOne.mockResolvedValue(phone);

    const response = await service.verify(pendingUser.id, "phone");

    expect(response.registrationState.accountStatus).toBe("ACTIVE");
    expect(pendingUser).toMatchObject({ isEmailValidated: true, isPhoneValidated: true });
  });

  it("transfers an unverified pending claim after OTP proof", async () => {
    const claim = makeContact({ isOwner: false });
    const previousOwner = makeContact({ id: "previous-claim", userId: "previous-user" });
    contacts.find.mockResolvedValue([claim]);
    contacts.findOne.mockResolvedValueOnce(claim).mockResolvedValueOnce(previousOwner);
    users.findOneBy.mockImplementation(({ id }: { id: string }) =>
      Promise.resolve(id === "previous-user" ? makeUser({ id }) : pendingUser)
    );

    await service.verify(pendingUser.id, "email");

    expect(previousOwner).toMatchObject({ isOwner: false, isTransferred: true });
    expect(claim).toMatchObject({ isOwner: true, isVerified: true });
    expect(contacts.save).toHaveBeenCalledWith(previousOwner);
  });

  it("does not transfer a verified contact from an active account", async () => {
    const claim = makeContact({ isOwner: false });
    const previousOwner = makeContact({ userId: "active-user", isVerified: true });
    contacts.find.mockResolvedValue([claim]);
    contacts.findOne.mockResolvedValueOnce(claim).mockResolvedValueOnce(previousOwner);
    users.findOneBy.mockImplementation(({ id }: { id: string }) =>
      Promise.resolve(
        id === "active-user" ? makeUser({ id, registrationStatus: "ACTIVE" }) : pendingUser
      )
    );

    await service.verify(pendingUser.id, "email");

    expect(previousOwner).toMatchObject({ isOwner: true, isVerified: true });
    expect(claim).toMatchObject({ isOwner: false, isRemoved: true, isVerified: false });
    expect(pendingUser.registrationStatus).toBe("PENDING_VERIFICATION");
  });

  it("expires an inactive registration and releases its claims and refresh sessions", async () => {
    pendingUser.registrationExpiresAt = NOW;

    await expect(service.state(pendingUser.id)).resolves.toMatchObject({
      accountStatus: "EXPIRED",
      nextAction: "REGISTRATION_EXPIRED"
    });
    expect(contacts.update).toHaveBeenCalledWith({ userId: pendingUser.id }, { isOwner: false });
    expect(refreshSessions.delete).toHaveBeenCalledWith({ userId: pendingUser.id });
  });

  it("rejects OTP requests after expiry", async () => {
    pendingUser.registrationExpiresAt = NOW;

    await expect(service.sendChallenge(pendingUser.id, "email")).rejects.toThrow(
      UnauthorizedException
    );
    expect(contacts.find).not.toHaveBeenCalled();
    expect(refreshSessions.delete).toHaveBeenCalledWith({ userId: pendingUser.id });
  });

  it("does not renew inactivity or issue another refresh token when only updating session state", async () => {
    await service.session(pendingUser, false);

    expect(jwt.signAsync).toHaveBeenCalledTimes(1);
    expect(jwt.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ tokenType: "registration" }),
      expect.any(Object)
    );
    expect(users.update).not.toHaveBeenCalled();
    expect(refreshSessions.save).not.toHaveBeenCalled();
  });

  it("rejects reuse of a consumed refresh token ID before issuing tokens", async () => {
    refreshSessions.delete.mockResolvedValue({ affected: 0 });

    await expect(service.rotateRefreshSession(pendingUser.id, "used-id")).rejects.toThrow(
      UnauthorizedException
    );
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it("rotates an existing refresh session without extending registration expiry", async () => {
    const response = await service.rotateRefreshSession(pendingUser.id, "old-id");

    expect(refreshSessions.delete).toHaveBeenCalledWith({
      userId: pendingUser.id,
      tokenId: "old-id"
    });
    const savedSession = refreshSessions.save.mock.calls[0][0];
    expect(savedSession.userId).toBe(pendingUser.id);
    expect(savedSession.tokenId).toEqual(expect.any(String));
    expect(savedSession.tokenId).not.toBe("old-id");
    expect(response.refreshToken).toBe("signed-token");
    expect(users.update).not.toHaveBeenCalled();
  });
});
