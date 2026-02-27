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
import { AllExceptionsFilter } from "./modules/logger/exceptions/exceptions.filter";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerModule } from "./modules/logger/logger.module";
import { LoggingInterceptor } from "./modules/logger/logging/logging.interceptor";
// import { PoliciesGuard } from "./casl/policies.guard";
import { CaslModule } from "./casl/casl.module";
import { PoliciesGuard } from "./casl/policies.guard";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";

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
    OtpModule,
    LoggerModule,
    CaslModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PoliciesGuard }
  ]
})
export class AppModule {}
