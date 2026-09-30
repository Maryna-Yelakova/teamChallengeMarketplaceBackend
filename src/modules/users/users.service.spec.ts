/** Unit tests for UsersService with persistence, logging, authorization, and hashing isolated. */
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { createMongoAbility } from "@casl/ability";
import * as bcrypt from "bcrypt";
import { UsersService } from "./users.service";
import { LoggerService } from "../logger/logger.service";
import { User } from "../../entities/user.entity";
import { Action } from "../casl/casl-ability.types";
import type { AppAbility, Subjects } from "../casl/casl-ability.types";
import type { ContextLogger } from "../logger/types/logger.types";
import type { CreateUserDto } from "./dtos/create-user.dto";
import type { UpdateUsersDto } from "./dtos/update-user.dto";
import type { ChangePasswordDto } from "../auth/dtos/change-password.dto";
import type { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere } from "typeorm";

jest.mock("bcrypt");

describe("UsersService", () => {
  /** Service instance created by the Nest testing module. */
  let service: UsersService;

  /** Type-safe bcrypt promise overloads used by UsersService. */
  const comparePasswordMock = bcrypt.compare as unknown as jest.Mock<
    Promise<boolean>,
    [string, string]
  >;
  const hashPasswordMock = bcrypt.hash as unknown as jest.Mock<Promise<string>, [string, number]>;

  /** Repository operations used by UsersService. */
  const usersRepositoryMock = {
    findOne: jest.fn<Promise<User | null>, [FindOneOptions<User>]>(),
    create: jest.fn<User, [DeepPartial<User>]>(),
    save: jest.fn<Promise<User>, [DeepPartial<User>]>(),
    delete: jest.fn<Promise<DeleteResult>, [FindOptionsWhere<User>]>()
  };

  /** Context logger returned to UsersService by the base logger. */
  const contextLoggerMock: jest.Mocked<ContextLogger> = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  };

  /** Base logger dependency used during service construction. */
  const loggerServiceMock = {
    withService: jest.fn<ContextLogger, [string]>()
  };

  /** Ability that permits the user operations exercised by these tests. */
  const ability: AppAbility = createMongoAbility<[Action, Subjects]>([
    { action: Action.Manage, subject: "all" }
  ]);

  /** Build a complete User entity with optional field overrides. */
  const createUserFixture = (overrides: Partial<User> = {}): User => ({
    id: "user-id",
    firstName: "Ada",
    phone: "+390000000001",
    isPhoneValidated: false,
    email: "ada@example.com",
    isEmailValidated: false,
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

  /** Reset mocks and create a fresh service for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();
    loggerServiceMock.withService.mockReturnValue(contextLoggerMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepositoryMock },
        { provide: LoggerService, useValue: loggerServiceMock }
      ]
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it("creates, logs, and saves a new user", async () => {
    const dto: CreateUserDto = {
      firstName: "Ada",
      phone: "+390000000001",
      email: "ada@example.com",
      password: "hashed-password",
      isSeller: false
    };
    const user = createUserFixture(dto);
    usersRepositoryMock.findOne.mockResolvedValue(null);
    usersRepositoryMock.create.mockReturnValue(user);
    usersRepositoryMock.save.mockResolvedValue(user);

    await expect(service.create(dto)).resolves.toEqual(user);
    expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
    expect(contextLoggerMock.debug).toHaveBeenCalledWith({
      message: "User created",
      userId: user.id
    });
    expect(usersRepositoryMock.save).toHaveBeenCalledWith(user);
  });

  it("rejects an email that is already registered", async () => {
    const user = createUserFixture();
    usersRepositoryMock.findOne.mockResolvedValue(user);

    await expect(
      service.create({
        firstName: user.firstName,
        phone: user.phone,
        email: user.email,
        password: user.password,
        isSeller: user.isSeller
      })
    ).rejects.toThrow(BadRequestException);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("finds a user by email", async () => {
    const user = createUserFixture();
    usersRepositoryMock.findOne.mockResolvedValue(user);
    await expect(service.findByEmail(user.email)).resolves.toEqual(user);
    expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
  });

  it("finds a user by phone", async () => {
    const user = createUserFixture();
    usersRepositoryMock.findOne.mockResolvedValue(user);
    await expect(service.findByPhone(user.phone)).resolves.toEqual(user);
    expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({ where: { phone: user.phone } });
  });

  it("returns an authorized user without the password", async () => {
    const user = createUserFixture();
    usersRepositoryMock.findOne.mockResolvedValue(user);

    const result = await service.findById(user.id, ability);

    expect(result).toMatchObject({ id: user.id, email: user.email });
    expect(result).not.toHaveProperty("password");
  });

  it("throws when a user ID is not found", async () => {
    usersRepositoryMock.findOne.mockResolvedValue(null);
    await expect(service.findById("missing-id", ability)).rejects.toThrow(NotFoundException);
  });

  it("updates and saves an authorized user", async () => {
    const user = createUserFixture();
    const dto: UpdateUsersDto = { firstName: "Grace" };
    const updated = createUserFixture({ firstName: dto.firstName });
    usersRepositoryMock.findOne.mockResolvedValue(user);
    usersRepositoryMock.save.mockResolvedValue(updated);

    await expect(service.update(user.id, dto, ability)).resolves.toEqual(updated);
    expect(usersRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining(dto));
  });

  it("marks a phone as validated", async () => {
    const user = createUserFixture();
    usersRepositoryMock.findOne.mockResolvedValue(user);
    usersRepositoryMock.save.mockImplementation(value => Promise.resolve(value as User));

    await expect(service.markPhoneAsValidated(user.phone)).resolves.toMatchObject({
      isPhoneValidated: true
    });
  });

  it("marks an email as validated", async () => {
    const user = createUserFixture();
    usersRepositoryMock.findOne.mockResolvedValue(user);
    usersRepositoryMock.save.mockImplementation(value => Promise.resolve(value as User));

    await expect(service.markEmailAsValidated(user.email)).resolves.toMatchObject({
      isEmailValidated: true
    });
  });

  it("deletes an authorized user", async () => {
    const user = createUserFixture();
    usersRepositoryMock.findOne.mockResolvedValue(user);
    usersRepositoryMock.delete.mockResolvedValue({ affected: 1, raw: [] });

    await expect(service.delete(user.id, ability)).resolves.toBeUndefined();
    expect(usersRepositoryMock.delete).toHaveBeenCalledWith({ id: user.id });
  });

  it("changes a unique phone and resets phone validation", async () => {
    const user = createUserFixture({ isPhoneValidated: true });
    const newPhone = "+390000000002";
    usersRepositoryMock.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    usersRepositoryMock.save.mockImplementation(value => Promise.resolve(value as User));

    await expect(service.changePhone(user.id, newPhone, ability)).resolves.toMatchObject({
      phone: newPhone,
      isPhoneValidated: false
    });
  });

  it("changes a valid current password", async () => {
    const user = createUserFixture();
    const dto: ChangePasswordDto = {
      currentPassword: "old-password",
      newPassword: "new-password"
    };
    usersRepositoryMock.findOne.mockResolvedValue(user);
    comparePasswordMock.mockResolvedValue(true);
    hashPasswordMock.mockResolvedValue("new-hash");
    usersRepositoryMock.save.mockResolvedValue({ ...user, password: "new-hash" });

    await expect(service.changePassword(user.id, dto, ability)).resolves.toEqual({
      message: "Password changed successfully"
    });
    expect(comparePasswordMock).toHaveBeenCalledWith(dto.currentPassword, "hashed-password");
    expect(hashPasswordMock).toHaveBeenCalledWith(dto.newPassword, 10);
    expect(usersRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ password: "new-hash" })
    );
  });

  it("deletes users that remain unverified after two days", async () => {
    usersRepositoryMock.delete.mockResolvedValue({ affected: 1, raw: [] });

    await expect(service.deleteUnverifiedUsers()).resolves.toBeUndefined();
    expect(usersRepositoryMock.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(Object) as object,
        isEmailValidated: false,
        isPhoneValidated: false
      })
    );
  });
});
