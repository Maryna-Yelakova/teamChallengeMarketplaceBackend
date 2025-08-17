import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SellersModule } from "./modules/sellers/sellers.module";
import { ProductsModule } from "./modules/products/products.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { SubcategoriesModule } from "./modules/subcategories/subcategories.module";
import { OtpModule } from "./modules/otp/otp.module";


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    SellersModule,
    ProductsModule,
    CategoriesModule,
    SubcategoriesModule,
    OtpModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
