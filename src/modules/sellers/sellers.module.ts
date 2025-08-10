import { Module } from "@nestjs/common";
import { SellersService } from "./sellers.service";
import { SellersController } from "./sellers.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seller } from "src/entities/seller.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  controllers: [SellersController],
  providers: [SellersService],
  exports: [SellersService]
})
export class SellersModule {}
