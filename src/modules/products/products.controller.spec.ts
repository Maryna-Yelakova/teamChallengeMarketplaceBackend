/** Unit tests for ProductsController with ProductsService isolated by a typed mock. */
import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import type { Product } from "../../entities/product.entity";
import type { CreateProductDto } from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";

describe("ProductsController", () => {
  /** Controller instance created by the Nest testing module. */
  let controller: ProductsController;

  /** Mock of every ProductsService method called by ProductsController. */
  const productsServiceMock: jest.Mocked<
    Pick<ProductsService, "create" | "findAll" | "findOne" | "update" | "remove">
  > = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  /** Reset mock state and create a fresh controller for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsServiceMock
        }
      ]
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  /** Build a complete Product result while allowing each test to override relevant fields. */
  const createProductFixture = (overrides: Partial<Product> = {}): Product => ({
    id: "product-id",
    seller: {} as Product["seller"],
    sellerId: "seller-id",
    subcategory: {} as Product["subcategory"],
    subcategoryId: "subcategory-id",
    name: "Laptop",
    description: "A test laptop",
    price: 999,
    stock: 5,
    reviews: [],
    ...overrides
  });

  it("delegates product creation to ProductsService", async () => {
    const dto: CreateProductDto = {
      name: "Laptop",
      price: 999,
      stock: 5,
      sellerId: "seller-id",
      subcategoryId: "subcategory-id"
    };

    const createdProduct = createProductFixture(dto);

    productsServiceMock.create.mockResolvedValue(createdProduct);

    await expect(controller.create(dto)).resolves.toEqual(createdProduct);

    expect(productsServiceMock.create).toHaveBeenCalledTimes(1);
    expect(productsServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it("returns all products from ProductsService", async () => {
    const products = [
      createProductFixture(),
      createProductFixture({
        id: "product-id-2",
        name: "Phone"
      })
    ];

    productsServiceMock.findAll.mockResolvedValue(products);

    await expect(controller.findAll()).resolves.toEqual(products);

    expect(productsServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(productsServiceMock.findAll).toHaveBeenCalledWith();
  });

  it("returns a product by ID", async () => {
    const productId = "product-id";
    const product = createProductFixture({ id: productId });

    productsServiceMock.findOne.mockResolvedValue(product);

    await expect(controller.findOne(productId)).resolves.toEqual(product);

    expect(productsServiceMock.findOne).toHaveBeenCalledTimes(1);
    expect(productsServiceMock.findOne).toHaveBeenCalledWith(productId);
  });

  it("passes the product ID and update DTO to ProductsService", async () => {
    const dto: UpdateProductDto = {
      price: 899
    };

    const updatedProduct = createProductFixture({
      price: dto.price
    });

    productsServiceMock.update.mockResolvedValue(updatedProduct);

    await expect(controller.update("product-id", dto)).resolves.toEqual(updatedProduct);

    expect(productsServiceMock.update).toHaveBeenCalledTimes(1);
    expect(productsServiceMock.update).toHaveBeenCalledWith("product-id", dto);
  });

  it("delegates product removal to ProductsService", async () => {
    productsServiceMock.remove.mockResolvedValue(undefined);

    await expect(controller.remove("product-id")).resolves.toBeUndefined();

    expect(productsServiceMock.remove).toHaveBeenCalledTimes(1);
    expect(productsServiceMock.remove).toHaveBeenCalledWith("product-id");
  });
});
