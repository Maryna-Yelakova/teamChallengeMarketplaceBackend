/** Unit tests for SubcategoriesController with its service isolated by a typed mock. */
import { Test, TestingModule } from "@nestjs/testing";
import { SubcategoriesController } from "./subcategories.controller";
import { SubcategoriesService } from "./subcategories.service";
import type { Category } from "../../entities/category.entity";
import type { Subcategory } from "../../entities/subcategory.entity";
import type { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import type { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";

describe("SubcategoriesController", () => {
  /** Controller instance created by the Nest testing module. */
  let controller: SubcategoriesController;

  /** Mock of every SubcategoriesService method called by the controller. */
  const subcategoriesServiceMock: jest.Mocked<
    Pick<SubcategoriesService, "create" | "findAll" | "findOne" | "update" | "remove">
  > = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  /** Build a complete Subcategory result with optional field overrides. */
  const createSubcategoryFixture = (overrides: Partial<Subcategory> = {}): Subcategory => ({
    id: "subcategory-id",
    name: "Laptops",
    category: {} as Category,
    categoryId: "category-id",
    children: [],
    products: [],
    ...overrides
  });

  /** Reset mock state and create a fresh controller for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategoriesController],
      providers: [{ provide: SubcategoriesService, useValue: subcategoriesServiceMock }]
    }).compile();
    controller = module.get<SubcategoriesController>(SubcategoriesController);
  });

  it("delegates subcategory creation to SubcategoriesService", async () => {
    const dto: CreateSubcategoryDto = { name: "Laptops", categoryId: "category-id" };
    const subcategory = createSubcategoryFixture(dto);
    subcategoriesServiceMock.create.mockResolvedValue(subcategory);

    await expect(controller.create(dto)).resolves.toEqual(subcategory);
    expect(subcategoriesServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it("returns all subcategories", async () => {
    const subcategories = [createSubcategoryFixture()];
    subcategoriesServiceMock.findAll.mockResolvedValue(subcategories);

    await expect(controller.findAll()).resolves.toEqual(subcategories);
    expect(subcategoriesServiceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it("returns a subcategory by ID", async () => {
    const subcategoryId = "subcategory-id";
    const subcategory = createSubcategoryFixture({ id: subcategoryId });
    subcategoriesServiceMock.findOne.mockResolvedValue(subcategory);

    await expect(controller.findOne(subcategoryId)).resolves.toEqual(subcategory);
    expect(subcategoriesServiceMock.findOne).toHaveBeenCalledWith(subcategoryId);
  });

  it("passes the subcategory ID and update DTO to SubcategoriesService", async () => {
    const subcategoryId = "subcategory-id";
    const dto: UpdateSubcategoryDto = { name: "Ultrabooks" };
    const subcategory = createSubcategoryFixture({ id: subcategoryId, ...dto });
    subcategoriesServiceMock.update.mockResolvedValue(subcategory);

    await expect(controller.update(subcategoryId, dto)).resolves.toEqual(subcategory);
    expect(subcategoriesServiceMock.update).toHaveBeenCalledWith(subcategoryId, dto);
  });

  it("delegates subcategory removal to SubcategoriesService", async () => {
    const subcategoryId = "subcategory-id";
    subcategoriesServiceMock.remove.mockResolvedValue(undefined);

    await expect(controller.remove(subcategoryId)).resolves.toBeUndefined();
    expect(subcategoriesServiceMock.remove).toHaveBeenCalledWith(subcategoryId);
  });
});
