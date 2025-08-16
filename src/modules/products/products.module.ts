import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product } from "../../entities/product.entity";
import { Seller } from "../../entities/seller.entity";
import { SellersService } from "../sellers/sellers.service";
import { SubcategoriesModule } from "../subcategories/subcategories.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Seller]), SubcategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, SellersService],
  exports: [ProductsService]
})
export class ProductsModule {}
