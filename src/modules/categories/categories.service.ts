import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../../entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepo.create(dto);
    return await this.categoriesRepo.save(category);
  }

  findAll() {
    return this.categoriesRepo.find({ relations: ["subcategories"] });
  }

  async findOne(id: string) {
    const category = await this.categoriesRepo.findOne({
      where: { id },
      relations: ["subcategories"]
    });
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.categoriesRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.categoriesRepo.delete(id);
  }
}
