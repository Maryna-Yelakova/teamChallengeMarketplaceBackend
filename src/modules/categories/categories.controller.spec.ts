/** Unit tests for CategoriesController with CategoriesService isolated by a typed mock. */
import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import type { Category } from "../../entities/category.entity";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";

describe("CategoriesController", () => {
  /** Controller instance created by the Nest testing module. */
  let controller: CategoriesController;

  /** Mock of every CategoriesService method called by CategoriesController. */
  const categoriesServiceMock: jest.Mocked<
    Pick<CategoriesService, "create" | "findAll" | "findOne" | "update" | "remove">
  > = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  /** Build a complete Category result with optional field overrides. */
  const createCategoryFixture = (overrides: Partial<Category> = {}): Category => ({
    id: "category-id",
    name: "Electronics",
    description: "Electronic products",
    subcategories: [],
    ...overrides
  });

  /** Reset mock state and create a fresh controller for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: categoriesServiceMock }]
    }).compile();
    controller = module.get<CategoriesController>(CategoriesController);
  });

  it("delegates category creation to CategoriesService", async () => {
    const dto: CreateCategoryDto = { name: "Electronics", description: "Electronic products" };
    const category = createCategoryFixture(dto);
    categoriesServiceMock.create.mockResolvedValue(category);

    await expect(controller.create(dto)).resolves.toEqual(category);
    expect(categoriesServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it("returns all categories", async () => {
    const categories = [createCategoryFixture(), createCategoryFixture({ id: "category-id-2" })];
    categoriesServiceMock.findAll.mockResolvedValue(categories);

    await expect(controller.findAll()).resolves.toEqual(categories);
    expect(categoriesServiceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it("returns a category by ID", async () => {
    const categoryId = "category-id";
    const category = createCategoryFixture({ id: categoryId });
    categoriesServiceMock.findOne.mockResolvedValue(category);

    await expect(controller.findOne(categoryId)).resolves.toEqual(category);
    expect(categoriesServiceMock.findOne).toHaveBeenCalledWith(categoryId);
  });

  it("passes the category ID and update DTO to CategoriesService", async () => {
    const categoryId = "category-id";
    const dto: UpdateCategoryDto = { name: "Updated Electronics" };
    const category = createCategoryFixture({ id: categoryId, ...dto });
    categoriesServiceMock.update.mockResolvedValue(category);

    await expect(controller.update(categoryId, dto)).resolves.toEqual(category);
    expect(categoriesServiceMock.update).toHaveBeenCalledWith(categoryId, dto);
  });

  it("delegates category removal to CategoriesService", async () => {
    const categoryId = "category-id";
    categoriesServiceMock.remove.mockResolvedValue(undefined);

    await expect(controller.remove(categoryId)).resolves.toBeUndefined();
    expect(categoriesServiceMock.remove).toHaveBeenCalledWith(categoryId);
  });
});
