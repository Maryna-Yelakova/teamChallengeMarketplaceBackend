/** Unit tests for SubcategoriesService with repository and service dependencies mocked. */
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SubcategoriesService } from "./subcategories.service";
import { CategoriesService } from "../categories/categories.service";
import { Subcategory } from "../../entities/subcategory.entity";
import type { Category } from "../../entities/category.entity";
import type { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import type { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import type { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

describe("SubcategoriesService", () => {
  /** Service instance created by the Nest testing module. */
  let service: SubcategoriesService;

  /** TypeORM operations used by SubcategoriesService. */
  const subcategoriesRepositoryMock = {
    create: jest.fn<Subcategory, [DeepPartial<Subcategory>]>(),
    save: jest.fn<Promise<Subcategory>, [Subcategory]>(),
    find: jest.fn<Promise<Subcategory[]>, [FindManyOptions<Subcategory>]>(),
    findOne: jest.fn<Promise<Subcategory | null>, [FindOneOptions<Subcategory>]>(),
    findOneBy: jest.fn<Promise<Subcategory | null>, [FindOptionsWhere<Subcategory>]>(),
    remove: jest.fn<Promise<Subcategory>, [Subcategory]>()
  };

  /** Category lookup used to validate category assignments. */
  const categoriesServiceMock: jest.Mocked<Pick<CategoriesService, "findOne">> = {
    findOne: jest.fn()
  };

  /** Build a complete Category entity for relationship tests. */
  const createCategoryFixture = (overrides: Partial<Category> = {}): Category => ({
    id: "category-id",
    name: "Electronics",
    subcategories: [],
    ...overrides
  });

  /** Build a complete Subcategory entity with optional field overrides. */
  const createSubcategoryFixture = (overrides: Partial<Subcategory> = {}): Subcategory => ({
    id: "subcategory-id",
    name: "Laptops",
    category: createCategoryFixture(),
    categoryId: "category-id",
    children: [],
    products: [],
    ...overrides
  });

  /** Reset mock state and create a fresh service for each test. */
  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubcategoriesService,
        { provide: getRepositoryToken(Subcategory), useValue: subcategoriesRepositoryMock },
        { provide: CategoriesService, useValue: categoriesServiceMock }
      ]
    }).compile();
    service = module.get<SubcategoriesService>(SubcategoriesService);
  });

  it("creates and saves a subcategory for an existing category", async () => {
    const dto: CreateSubcategoryDto = { name: "Laptops", categoryId: "category-id" };
    const subcategory = createSubcategoryFixture(dto);
    categoriesServiceMock.findOne.mockResolvedValue(createCategoryFixture());
    subcategoriesRepositoryMock.create.mockReturnValue(subcategory);
    subcategoriesRepositoryMock.save.mockResolvedValue(subcategory);

    await expect(service.create(dto)).resolves.toEqual(subcategory);
    expect(categoriesServiceMock.findOne).toHaveBeenCalledWith(dto.categoryId);
    expect(subcategoriesRepositoryMock.create).toHaveBeenCalledWith(dto);
    expect(subcategoriesRepositoryMock.save).toHaveBeenCalledWith(subcategory);
  });

  it("throws when a requested parent subcategory does not exist", async () => {
    const dto: CreateSubcategoryDto = {
      name: "Ultrabooks",
      categoryId: "category-id",
      parentSubcategoryId: "missing-parent"
    };
    categoriesServiceMock.findOne.mockResolvedValue(createCategoryFixture());
    subcategoriesRepositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(subcategoriesRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("returns all subcategories with their relations", async () => {
    const subcategories = [createSubcategoryFixture()];
    subcategoriesRepositoryMock.find.mockResolvedValue(subcategories);

    await expect(service.findAll()).resolves.toEqual(subcategories);
    expect(subcategoriesRepositoryMock.find).toHaveBeenCalledWith({
      relations: ["category", "parentSubcategory", "children"]
    });
  });

  it("returns a subcategory by ID", async () => {
    const subcategory = createSubcategoryFixture();
    subcategoriesRepositoryMock.findOne.mockResolvedValue(subcategory);

    await expect(service.findOne(subcategory.id)).resolves.toEqual(subcategory);
    expect(subcategoriesRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: subcategory.id },
      relations: ["category", "parentSubcategory", "children"]
    });
  });

  it("throws when a subcategory is not found", async () => {
    subcategoriesRepositoryMock.findOne.mockResolvedValue(null);
    await expect(service.findOne("missing-id")).rejects.toThrow(NotFoundException);
  });

  it("updates category and parent relationships before saving", async () => {
    const dto: UpdateSubcategoryDto = {
      name: "Ultrabooks",
      categoryId: "new-category-id",
      parentSubcategoryId: "parent-id"
    };
    const subcategory = createSubcategoryFixture();
    const category = createCategoryFixture({ id: dto.categoryId });
    const parent = createSubcategoryFixture({ id: dto.parentSubcategoryId });
    subcategoriesRepositoryMock.findOne.mockResolvedValue(subcategory);
    categoriesServiceMock.findOne.mockResolvedValue(category);
    subcategoriesRepositoryMock.findOneBy.mockResolvedValue(parent);
    subcategoriesRepositoryMock.save.mockImplementation(value => Promise.resolve(value));

    await expect(service.update(subcategory.id, dto)).resolves.toMatchObject(dto);
    expect(subcategoriesRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ category, parentSubcategory: parent, ...dto })
    );
  });

  it("removes an existing subcategory", async () => {
    const subcategory = createSubcategoryFixture();
    subcategoriesRepositoryMock.findOne.mockResolvedValue(subcategory);
    subcategoriesRepositoryMock.remove.mockResolvedValue(subcategory);

    await expect(service.remove(subcategory.id)).resolves.toBeUndefined();
    expect(subcategoriesRepositoryMock.remove).toHaveBeenCalledWith(subcategory);
  });
});
