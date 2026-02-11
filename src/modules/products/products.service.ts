import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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

  async create(userId: string, { sellerId, subcategoryId, ...rest }: CreateProductDto) {
    const seller = await this.assertSellerOwnership(sellerId, userId);

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

  async update(id: string, userId: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    await this.assertSellerOwnership(product.sellerId, userId);

    const { sellerId, subcategoryId, ...rest } = updateProductDto;

    if (sellerId && sellerId !== product.sellerId) {
      const nextSeller = await this.assertSellerOwnership(sellerId, userId);
      product.seller = nextSeller;
      product.sellerId = nextSeller.id;
    }

    if (subcategoryId) {
      const subcategory = await this.subcategoriesService.findOne(subcategoryId);
      if (!subcategory) throw new NotFoundException("Subcategory not found");
      product.subcategory = subcategory;
      product.subcategoryId = subcategory.id;
    }

    Object.assign(product, rest);

    return this.productsRepo.save(product);
  }

  async remove(id: string, userId: string) {
    const product = await this.findOne(id);
    await this.assertSellerOwnership(product.sellerId, userId);
    await this.productsRepo.delete(id);
  }

  private async assertSellerOwnership(sellerId: string, userId: string): Promise<Seller> {
    const seller = await this.sellersService.findOne(sellerId);
    if (!seller) throw new NotFoundException("Seller not found");
    if (seller.userId !== userId) {
      throw new ForbiddenException("You can manage products only in your own shop");
    }
    return seller;
  }
}
