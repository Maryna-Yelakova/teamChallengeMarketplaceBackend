/** Unit tests for UsersController with UsersService isolated by a typed mock. */
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import type { User } from "../../entities/user.entity";
import type { AppAbility } from "../casl/casl-ability.types";
import type { RequestWithUser } from "../../common/types";
import type { UpdateUsersDto } from "./dtos/update-user.dto";
import type { ChangePhoneDto } from "./dtos/change-phone.dto";
import type { ChangePasswordDto } from "../auth/dtos/change-password.dto";

describe("UsersController", () => {
  /** Controller instance created by the Nest testing module. */
  let controller: UsersController;

  /** Mock of every UsersService method called by UsersController. */
  const usersServiceMock: jest.Mocked<
    Pick<
      UsersService,
      | "findById"
      | "findByEmail"
      | "findByPhone"
      | "delete"
      | "update"
      | "changePhone"
      | "changePassword"
    >
  > = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByPhone: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    changePhone: jest.fn(),
    changePassword: jest.fn()
  };

  /** Ability placeholder forwarded unchanged to the mocked service. */
  const ability = {} as AppAbility;

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

  /** Build the password-free shape returned by findById and changePhone. */
  const createPublicUserFixture = (overrides: Partial<User> = {}): Omit<User, "password"> => {
    const user = createUserFixture(overrides);
    const result = { ...user } as Partial<User>;
    delete result.password;
    return result as Omit<User, "password">;
  };

  /** Reset mock state and create a fresh controller for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }]
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });

  it("returns a user by ID", async () => {
    const user = createPublicUserFixture();
    usersServiceMock.findById.mockResolvedValue(user);

    await expect(controller.getUserById(user.id, ability)).resolves.toEqual(user);
    expect(usersServiceMock.findById).toHaveBeenCalledWith(user.id, ability);
  });

  it("reports when an email is present", async () => {
    const user = createUserFixture();
    usersServiceMock.findByEmail.mockResolvedValue(user);

    await expect(controller.isEmailPresent(user.email)).resolves.toEqual({ isPresent: true });
    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(user.email);
  });

  it("reports when a phone is absent", async () => {
    usersServiceMock.findByPhone.mockResolvedValue(null);

    await expect(controller.isPhonePresent("+390000000099")).resolves.toEqual({
      isPresent: false
    });
  });

  it("delegates user deletion", async () => {
    usersServiceMock.delete.mockResolvedValue(undefined);

    await expect(controller.delete("user-id", ability)).resolves.toBeUndefined();
    expect(usersServiceMock.delete).toHaveBeenCalledWith("user-id", ability);
  });

  it("passes the user ID, update DTO, and ability to UsersService", async () => {
    const dto: UpdateUsersDto = { firstName: "Grace" };
    const user = createUserFixture(dto);
    usersServiceMock.update.mockResolvedValue(user);

    await expect(controller.updateUser(user.id, dto, ability)).resolves.toEqual(user);
    expect(usersServiceMock.update).toHaveBeenCalledWith(user.id, dto, ability);
  });

  it("changes a phone and removes the password from the response", async () => {
    const dto: ChangePhoneDto = { newPhone: "+390000000002" };
    const user = createUserFixture({ phone: dto.newPhone });
    const expected = createPublicUserFixture({ phone: dto.newPhone });
    usersServiceMock.changePhone.mockResolvedValue(user);

    await expect(controller.changePhone(user.id, dto, ability)).resolves.toEqual(expected);
    expect(usersServiceMock.changePhone).toHaveBeenCalledWith(user.id, dto.newPhone, ability);
  });

  it("uses the authenticated user ID when changing a password", async () => {
    const request = {
      user: { userId: "user-id", identityWay: "email" }
    } as RequestWithUser;
    const dto: ChangePasswordDto = {
      currentPassword: "old-password",
      newPassword: "new-password"
    };
    const result = { message: "Password changed successfully" };
    usersServiceMock.changePassword.mockResolvedValue(result);

    await expect(controller.changePassword(request, dto, ability)).resolves.toEqual(result);
    expect(usersServiceMock.changePassword).toHaveBeenCalledWith(request.user.userId, dto, ability);
  });
});
