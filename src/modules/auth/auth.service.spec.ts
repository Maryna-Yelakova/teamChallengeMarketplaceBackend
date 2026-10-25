/** Covers JSON sessions, revocation, and rejection of unfinished account logins. */
import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { RegistrationService } from "../registration/registration.service";
import type { User } from "../../entities/user.entity";
import type { Response } from "express";

jest.mock("bcrypt");

describe("AuthService", () => {
  let service: AuthService;
  const users = {
    findByEmail: jest.fn(),
    findByPhone: jest.fn()
  };
  const registrations = {
    start: jest.fn(),
    session: jest.fn(),
    rotateRefreshSession: jest.fn(),
    revokeSessions: jest.fn()
  };
  const user: User = {
    id: "user-id",
    firstName: "Ada",
    phone: "+390000000001",
    isPhoneValidated: true,
    email: "ada@example.com",
    isEmailValidated: true,
    password: "hashed",
    isSeller: false,
    tokenVersion: 2,
    registrationStatus: "ACTIVE",
    registrationExpiresAt: null,
    lastMeaningfulActivityAt: null,
    sellers: [],
    addresses: [],
    carts: [],
    wishlists: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: users },
        { provide: RegistrationService, useValue: registrations }
      ]
    }).compile();
    service = module.get(AuthService);
  });

  it("delegates registration to the registration flow", async () => {
    registrations.start.mockResolvedValue({ userId: "user-id" });
    await expect(
      service.register({} as Response, { firstName: "Ada", password: "pass" })
    ).resolves.toEqual({ userId: "user-id" });
  });

  it("returns a JSON session on login", async () => {
    jest
      .spyOn(service, "validateUser")
      .mockResolvedValue({ ...user, password: undefined } as never);
    registrations.session.mockResolvedValue({
      userId: user.id,
      accessToken: "access",
      refreshToken: "refresh",
      registrationState: { accountStatus: "ACTIVE" }
    });
    const response = await service.login({} as Response, user.email!, "pass");
    expect(response).toMatchObject({
      accessToken: "access",
      refreshToken: "refresh",
      userId: user.id,
      registrationState: { accountStatus: "ACTIVE" },
      isEmailValidated: true,
      isPhoneValidated: true
    });
    expect(registrations.session).toHaveBeenCalledWith(expect.objectContaining({ id: user.id }));
  });

  it("revokes refresh sessions on logout", async () => {
    await expect(service.logout({} as Response, user.id)).resolves.toEqual({
      message: "Logged out successfully"
    });
    expect(registrations.revokeSessions).toHaveBeenCalledWith(user.id);
  });

  it("returns a rotated JSON session on refresh", async () => {
    registrations.rotateRefreshSession.mockResolvedValue({
      accessToken: "new-access",
      refreshToken: "new-refresh"
    });
    await expect(service.refresh(user.id, "token-id")).resolves.toEqual({
      accessToken: "new-access",
      refreshToken: "new-refresh"
    });
    expect(registrations.rotateRefreshSession).toHaveBeenCalledWith(user.id, "token-id");
  });

  it("rejects a pending account for password login", async () => {
    users.findByEmail.mockResolvedValue({ ...user, registrationStatus: "PENDING_VERIFICATION" });
    await expect(service.validateUser(user.email!, "pass")).rejects.toThrow(UnauthorizedException);
  });

  it("rejects invalid credentials with a generic response", async () => {
    users.findByPhone.mockResolvedValue(null);
    await expect(service.validateUser("+390000000099", "pass")).rejects.toThrow(
      "Invalid credentials"
    );
  });
});
