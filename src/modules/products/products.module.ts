import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product } from "../../entities/product.entity";
import { SellersModule } from "../sellers/sellers.module";
import { SubcategoriesModule } from "../subcategories/subcategories.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SellersModule, SubcategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
