import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import { Subcategory } from "../../entities/subcategory.entity";
import { CategoriesService } from "../categories/categories.service";

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepo: Repository<Subcategory>,

    private readonly categoriesService: CategoriesService
  ) {}

  async create(dto: CreateSubcategoryDto) {
    const category = await this.categoriesService.findOne(dto.categoryId);
    if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);

    let parentSubcategory: Subcategory | null = null;
    if (dto.parentSubcategoryId) {
      parentSubcategory = await this.subcategoryRepo.findOneBy({ id: dto.parentSubcategoryId });
      if (!parentSubcategory)
        throw new NotFoundException(`Parent subcategory ${dto.parentSubcategoryId} not found`);
    }

    const subcategory = this.subcategoryRepo.create(dto);

    return this.subcategoryRepo.save(subcategory);
  }

  findAll() {
    return this.subcategoryRepo.find({
      relations: ["category", "parentSubcategory", "children"]
    });
  }

  async findOne(id: string) {
    const subcategory = await this.subcategoryRepo.findOne({
      where: { id },
      relations: ["category", "parentSubcategory", "children"]
    });
    if (!subcategory) throw new NotFoundException(`Subcategory ${id} not found`);
    return subcategory;
  }

  async update(id: string, dto: UpdateSubcategoryDto) {
    const subcategory = await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.categoriesService.findOne(dto.categoryId);
      if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);
      subcategory.category = category;
    }

    if (dto.parentSubcategoryId) {
      const parentSubcategory = await this.subcategoryRepo.findOneBy({
        id: dto.parentSubcategoryId
      });
      if (!parentSubcategory)
        throw new NotFoundException(`Parent subcategory ${dto.parentSubcategoryId} not found`);
      subcategory.parentSubcategory = parentSubcategory;
    }

    Object.assign(subcategory, dto);

    return this.subcategoryRepo.save(subcategory);
  }

  async remove(id: string) {
    const subcategory = await this.findOne(id);
    await this.subcategoryRepo.remove(subcategory);
  }
}
