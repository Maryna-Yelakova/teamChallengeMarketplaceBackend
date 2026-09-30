/** Unit tests for SellersService with its TypeORM repository isolated by a typed mock. */
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SellersService } from "./sellers.service";
import { Seller } from "../../entities/seller.entity";
import type { CreateSellerDto } from "./dto/create-seller.dto";
import type { UpdateSellerDto } from "./dto/update-seller.dto";
import type { DeepPartial, FindOneOptions } from "typeorm";

describe("SellersService", () => {
  /** Service instance created by the Nest testing module. */
  let service: SellersService;

  /** Repository operations used by SellersService. */
  const sellersRepositoryMock: {
    findOne: jest.Mock<Promise<Seller | null>, [FindOneOptions<Seller>]>;
    create: jest.Mock<Seller, [DeepPartial<Seller>]>;
    save: jest.Mock<Promise<Seller>, [Seller]>;
  } = {
    findOne: jest.fn<Promise<Seller | null>, [FindOneOptions<Seller>]>(),
    create: jest.fn<Seller, [DeepPartial<Seller>]>(),
    save: jest.fn<Promise<Seller>, [Seller]>()
  };

  /** Build a complete Seller entity while allowing test-specific overrides. */
  const createSellerFixture = (overrides: Partial<Seller> = {}): Seller => ({
    id: "seller-id",
    user: {} as Seller["user"],
    userId: "user-id",
    shopName: "Test Shop",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    products: [],
    reviews: [],
    ...overrides
  });

  /** Reset mock state and create a fresh service for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellersService,
        {
          provide: getRepositoryToken(Seller),
          useValue: sellersRepositoryMock
        }
      ]
    }).compile();

    service = module.get<SellersService>(SellersService);
  });

  describe("create", () => {
    it("creates and saves a seller when the shop name is available", async () => {
      const dto: CreateSellerDto = {
        userId: "user-id",
        shopName: "Test Shop"
      };
      const seller = createSellerFixture(dto);

      sellersRepositoryMock.findOne.mockResolvedValue(null);
      sellersRepositoryMock.create.mockReturnValue(seller);
      sellersRepositoryMock.save.mockResolvedValue(seller);

      await expect(service.create(dto)).resolves.toEqual(seller);

      expect(sellersRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { shopName: dto.shopName, userId: dto.userId }
      });
      expect(sellersRepositoryMock.create).toHaveBeenCalledWith(dto);
      expect(sellersRepositoryMock.save).toHaveBeenCalledWith(seller);
    });

    it("rejects a duplicate shop name for the same user", async () => {
      const dto: CreateSellerDto = {
        userId: "user-id",
        shopName: "Test Shop"
      };

      sellersRepositoryMock.findOne.mockResolvedValue(createSellerFixture(dto));

      await expect(service.create(dto)).rejects.toThrow(
        "Seller with this shop name already exists for the user"
      );
      expect(sellersRepositoryMock.create).not.toHaveBeenCalled();
      expect(sellersRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("returns a seller with its user and products", async () => {
      const sellerId = "seller-id";
      const seller = createSellerFixture({ id: sellerId });

      sellersRepositoryMock.findOne.mockResolvedValue(seller);

      await expect(service.findOne(sellerId)).resolves.toEqual(seller);
      expect(sellersRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: sellerId },
        relations: ["user", "products"]
      });
    });
  });

  describe("update", () => {
    it("describes the requested seller update", () => {
      const sellerId = "seller-id";
      const dto: UpdateSellerDto = { shopName: "Updated Shop" };

      expect(service.update(sellerId, dto)).toBe(
        `This action updates a #${sellerId} seller with data: ${JSON.stringify(dto)}`
      );
    });
  });

  describe("remove", () => {
    it("describes the requested seller removal", () => {
      const sellerId = "seller-id";

      expect(service.remove(sellerId)).toBe(`This action removes a #${sellerId} seller`);
    });
  });
});
