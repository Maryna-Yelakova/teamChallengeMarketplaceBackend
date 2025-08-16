import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../../entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { Seller } from "../../entities/seller.entity";

import { SellersService } from "../sellers/sellers.service";
import { SubcategoriesService } from "../subcategories/subcategories.service";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,

    private readonly sellersService: SellersService,

    private readonly subcategoriesService: SubcategoriesService
  ) {}

  async create({ sellerId, subcategoryId, ...rest }: CreateProductDto) {
    const seller: Seller | null = await this.sellersService.findOne(sellerId);
    if (!seller) throw new NotFoundException("Seller not found");

    const subcategory = await this.subcategoriesService.findOne(subcategoryId);
    if (!subcategory) throw new NotFoundException("Subcategory not found");

    const product = this.productsRepo.create({
      ...rest,
      seller,
      subcategory
    });

    return this.productsRepo.save(product);
  }

  findAll() {
    return this.productsRepo.find({ relations: ["seller", "subcategory"] });
  }

  async findOne(id: string) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ["seller", "subcategory"]
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // Оновлюємо тільки передані поля
    Object.assign(product, updateProductDto);

    return this.productsRepo.save(product);
  }

  async remove(id: string) {
    const result = await this.productsRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException("Product not found");
  }
}
