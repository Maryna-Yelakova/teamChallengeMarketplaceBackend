/** Unit tests for CategoriesService with its TypeORM repository isolated by a typed mock. */
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CategoriesService } from "./categories.service";
import { Category } from "../../entities/category.entity";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";
import type {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  UpdateResult
} from "typeorm";

describe("CategoriesService", () => {
  /** Service instance created by the Nest testing module. */
  let service: CategoriesService;

  /** Repository operations used by CategoriesService. */
  const categoriesRepositoryMock = {
    create: jest.fn<Category, [DeepPartial<Category>]>(),
    save: jest.fn<Promise<Category>, [Category]>(),
    find: jest.fn<Promise<Category[]>, [FindManyOptions<Category>]>(),
    findOne: jest.fn<Promise<Category | null>, [FindOneOptions<Category>]>(),
    update: jest.fn<Promise<UpdateResult>, [string, UpdateCategoryDto]>(),
    delete: jest.fn<Promise<DeleteResult>, [string]>()
  };

  /** Build a complete Category entity with optional field overrides. */
  const createCategoryFixture = (overrides: Partial<Category> = {}): Category => ({
    id: "category-id",
    name: "Electronics",
    description: "Electronic products",
    subcategories: [],
    ...overrides
  });

  /** Reset mock state and create a fresh service for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: categoriesRepositoryMock }
      ]
    }).compile();
    service = module.get<CategoriesService>(CategoriesService);
  });

  it("creates and saves a category", async () => {
    const dto: CreateCategoryDto = { name: "Electronics" };
    const category = createCategoryFixture(dto);
    categoriesRepositoryMock.create.mockReturnValue(category);
    categoriesRepositoryMock.save.mockResolvedValue(category);

    await expect(service.create(dto)).resolves.toEqual(category);
    expect(categoriesRepositoryMock.create).toHaveBeenCalledWith(dto);
    expect(categoriesRepositoryMock.save).toHaveBeenCalledWith(category);
  });

  it("returns all categories with subcategories", async () => {
    const categories = [createCategoryFixture()];
    categoriesRepositoryMock.find.mockResolvedValue(categories);

    await expect(service.findAll()).resolves.toEqual(categories);
    expect(categoriesRepositoryMock.find).toHaveBeenCalledWith({ relations: ["subcategories"] });
  });

  it("returns a category by ID", async () => {
    const category = createCategoryFixture();
    categoriesRepositoryMock.findOne.mockResolvedValue(category);

    await expect(service.findOne(category.id)).resolves.toEqual(category);
    expect(categoriesRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: category.id },
      relations: ["subcategories"]
    });
  });

  it("throws when a category is not found", async () => {
    categoriesRepositoryMock.findOne.mockResolvedValue(null);
    await expect(service.findOne("missing-id")).rejects.toThrow(NotFoundException);
  });

  it("updates a category and returns the refreshed entity", async () => {
    const categoryId = "category-id";
    const dto: UpdateCategoryDto = { name: "Updated Electronics" };
    const category = createCategoryFixture({ id: categoryId, ...dto });
    categoriesRepositoryMock.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });
    categoriesRepositoryMock.findOne.mockResolvedValue(category);

    await expect(service.update(categoryId, dto)).resolves.toEqual(category);
    expect(categoriesRepositoryMock.update).toHaveBeenCalledWith(categoryId, dto);
  });

  it("deletes a category by ID", async () => {
    categoriesRepositoryMock.delete.mockResolvedValue({ affected: 1, raw: [] });
    await expect(service.remove("category-id")).resolves.toBeUndefined();
    expect(categoriesRepositoryMock.delete).toHaveBeenCalledWith("category-id");
  });
});
