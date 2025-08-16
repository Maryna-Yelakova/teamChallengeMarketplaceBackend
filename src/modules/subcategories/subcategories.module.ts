import { Module } from "@nestjs/common";
import { SubcategoriesService } from "./subcategories.service";
import { SubcategoriesController } from "./subcategories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subcategory } from "src/entities/subcategory.entity";
import { Category } from "src/entities/category.entity";
import { CategoriesService } from "../categories/categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([Subcategory, Category])],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService, CategoriesService],
  exports: [SubcategoriesService]
})
export class SubcategoriesModule {}
