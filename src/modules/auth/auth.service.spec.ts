/** Unit tests for AuthService with users, JWT, config, hashing, and response I/O mocked. */
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import type { User } from "../../entities/user.entity";
import type { CreateUserDto } from "../users/dtos/create-user.dto";
import type { Response } from "express";

jest.mock("bcrypt");

describe("AuthService", () => {
  /** Service instance created by the Nest testing module. */
  let service: AuthService;
  let consoleLogSpy: jest.SpyInstance;

  /** Type-safe bcrypt promise overloads used by AuthService. */
  const comparePasswordMock = bcrypt.compare as unknown as jest.Mock<
    Promise<boolean>,
    [string, string]
  >;
  const hashPasswordMock = bcrypt.hash as unknown as jest.Mock<Promise<string>, [string, number]>;

  /** User operations required by AuthService. */
  const usersServiceMock: jest.Mocked<
    Pick<UsersService, "findByEmail" | "findByPhone" | "create">
  > = {
    findByEmail: jest.fn(),
    findByPhone: jest.fn(),
    create: jest.fn()
  };

  /** JWT signer used for access and refresh tokens. */
  const jwtServiceMock = {
    sign: jest.fn<string, [object, { expiresIn: string }]>()
  };

  /** Configuration lookup used during AuthService construction. */
  const configServiceMock = {
    getOrThrow: jest.fn<string, [string]>()
  };

  /** Build a complete User entity with optional field overrides. */
  const createUserFixture = (overrides: Partial<User> = {}): User => ({
    id: "user-id",
    firstName: "Ada",
    phone: "+390000000001",
    isPhoneValidated: true,
    email: "ada@example.com",
    isEmailValidated: true,
    password: "hashed-password",
    isSeller: false,
    sellers: [],
    addresses: [],
    carts: [],
    wishlists: [],
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides
  });

  /** Build the password-free user shape returned by validateUser. */
  const createValidatedUserFixture = (overrides: Partial<User> = {}): Omit<User, "password"> => {
    const user = { ...createUserFixture(overrides) } as Partial<User>;
    delete user.password;
    return user as Omit<User, "password">;
  };

  /** Build an Express response with an observable cookie method. */
  const createResponseMock = () => {
    const cookie = jest.fn();
    return { response: { cookie } as unknown as Response, cookie };
  };

  /** Reset mocks and create a fresh service for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();
    configServiceMock.getOrThrow.mockImplementation(key =>
      key === "JWT_ACCESS_TOKEN_TTL" ? "15m" : "7d"
    );
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock }
      ]
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("registers a user with a hashed password", async () => {
    const dto: CreateUserDto = {
      firstName: "Ada",
      phone: "+390000000001",
      email: "ada@example.com",
      password: "plain-password",
      isSeller: false
    };
    const user = createUserFixture();
    const { response } = createResponseMock();
    usersServiceMock.findByEmail.mockResolvedValue(null);
    usersServiceMock.findByPhone.mockResolvedValue(null);
    hashPasswordMock.mockResolvedValue("hashed-password");
    usersServiceMock.create.mockResolvedValue(user);

    await expect(service.register(response, dto)).resolves.toEqual({
      message: "User created",
      userId: user.id
    });
    expect(usersServiceMock.create).toHaveBeenCalledWith({
      ...dto,
      password: "hashed-password"
    });
  });

  it("rejects registration when the email is already used", async () => {
    const user = createUserFixture();
    const { response } = createResponseMock();
    usersServiceMock.findByEmail.mockResolvedValue(user);

    await expect(
      service.register(response, {
        firstName: user.firstName,
        phone: user.phone,
        email: user.email,
        password: "plain-password",
        isSeller: false
      })
    ).rejects.toThrow(ConflictException);
    expect(usersServiceMock.create).not.toHaveBeenCalled();
  });

  it("logs in a validated user and sets a refresh-token cookie", async () => {
    const validatedUser = createValidatedUserFixture();
    const { response, cookie } = createResponseMock();
    jest.spyOn(service, "validateUser").mockResolvedValue(validatedUser);
    jwtServiceMock.sign.mockReturnValueOnce("access-token").mockReturnValueOnce("refresh-token");

    await expect(service.login(response, validatedUser.email, "password")).resolves.toEqual({
      isPhoneValidated: true,
      isEmailValidated: true,
      accessToken: "access-token"
    });
    expect(cookie).toHaveBeenCalledWith(
      "refresh_token",
      "refresh-token",
      expect.objectContaining({ httpOnly: true, expires: expect.any(Date) as Date })
    );
  });

  it("logs out by expiring the refresh-token cookie", () => {
    const { response, cookie } = createResponseMock();

    expect(service.logout(response)).toEqual({ message: "Logged out successfully" });
    expect(cookie).toHaveBeenCalledWith("refresh_token", "", {
      httpOnly: true,
      expires: new Date(0)
    });
  });

  it("refreshes access and refresh tokens for a user", () => {
    const { response, cookie } = createResponseMock();
    jwtServiceMock.sign.mockReturnValueOnce("access-token").mockReturnValueOnce("refresh-token");

    expect(service.refresh("user-id", response)).toEqual({ accessToken: "access-token" });
    expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(
      1,
      { userId: "user-id", identityWay: "email" },
      { expiresIn: "15m" }
    );
    expect(cookie).toHaveBeenCalledWith(
      "refresh_token",
      "refresh-token",
      expect.objectContaining({ httpOnly: true })
    );
  });

  it("validates an email user and removes the password", async () => {
    const user = createUserFixture();
    usersServiceMock.findByEmail.mockResolvedValue(user);
    comparePasswordMock.mockResolvedValue(true);

    const result = await service.validateUser(user.email, "plain-password");

    expect(result).toMatchObject({ id: user.id, email: user.email });
    expect(result).not.toHaveProperty("password");
    expect(comparePasswordMock).toHaveBeenCalledWith("plain-password", user.password);
  });

  it("throws when authentication cannot find a user", async () => {
    usersServiceMock.findByPhone.mockResolvedValue(null);
    await expect(service.validateUser("+390000000099", "password")).rejects.toThrow(
      NotFoundException
    );
  });

  it("throws when the password is incorrect", async () => {
    const user = createUserFixture();
    usersServiceMock.findByEmail.mockResolvedValue(user);
    comparePasswordMock.mockResolvedValue(false);

    await expect(service.validateUser(user.email, "wrong-password")).rejects.toThrow(
      UnauthorizedException
    );
  });
});
