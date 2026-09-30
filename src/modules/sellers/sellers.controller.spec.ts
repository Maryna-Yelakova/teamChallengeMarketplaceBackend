/** Unit tests for SellersController with SellersService isolated by a typed mock. */
import { Test, TestingModule } from "@nestjs/testing";
import { SellersController } from "./sellers.controller";
import { SellersService } from "./sellers.service";
import type { Seller } from "../../entities/seller.entity";
import type { CreateSellerDto } from "./dto/create-seller.dto";
import type { UpdateSellerDto } from "./dto/update-seller.dto";

describe("SellersController", () => {
  /** Controller instance created by the Nest testing module. */
  let controller: SellersController;

  /** Mock of every SellersService method called by SellersController. */
  const sellersServiceMock: jest.Mocked<
    Pick<SellersService, "create" | "findOne" | "update" | "remove">
  > = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  /** Build a complete Seller result while allowing each test to override relevant fields. */
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

  /** Reset mock state and create a fresh controller for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellersController],
      providers: [
        {
          provide: SellersService,
          useValue: sellersServiceMock
        }
      ]
    }).compile();

    controller = module.get<SellersController>(SellersController);
  });

  it("delegates seller creation to SellersService", async () => {
    const dto: CreateSellerDto = {
      userId: "user-id",
      shopName: "Test Shop"
    };
    const seller = createSellerFixture(dto);

    sellersServiceMock.create.mockResolvedValue(seller);

    await expect(controller.create(dto)).resolves.toEqual(seller);
    expect(sellersServiceMock.create).toHaveBeenCalledTimes(1);
    expect(sellersServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it("returns a seller by ID", async () => {
    const sellerId = "seller-id";
    const seller = createSellerFixture({ id: sellerId });

    sellersServiceMock.findOne.mockResolvedValue(seller);

    await expect(controller.findOne(sellerId)).resolves.toEqual(seller);
    expect(sellersServiceMock.findOne).toHaveBeenCalledTimes(1);
    expect(sellersServiceMock.findOne).toHaveBeenCalledWith(sellerId);
  });

  it("passes the seller ID and update DTO to SellersService", () => {
    const sellerId = "seller-id";
    const dto: UpdateSellerDto = { shopName: "Updated Shop" };
    const result = `This action updates a #${sellerId} seller with data: ${JSON.stringify(dto)}`;

    sellersServiceMock.update.mockReturnValue(result);

    expect(controller.update(sellerId, dto)).toBe(result);
    expect(sellersServiceMock.update).toHaveBeenCalledTimes(1);
    expect(sellersServiceMock.update).toHaveBeenCalledWith(sellerId, dto);
  });

  it("delegates seller removal to SellersService", () => {
    const sellerId = "seller-id";
    const result = `This action removes a #${sellerId} seller`;

    sellersServiceMock.remove.mockReturnValue(result);

    expect(controller.remove(sellerId)).toBe(result);
    expect(sellersServiceMock.remove).toHaveBeenCalledTimes(1);
    expect(sellersServiceMock.remove).toHaveBeenCalledWith(sellerId);
  });
});
