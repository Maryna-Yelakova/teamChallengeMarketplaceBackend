"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entities/user.entity");
const seller_entity_1 = require("../../entities/seller.entity");
const address_entity_1 = require("../../entities/address.entity");
const cart_entity_1 = require("../../entities/cart.entity");
const wishlist_entity_1 = require("../../entities/wishlist.entity");
const product_entity_1 = require("../../entities/product.entity");
const subcategory_entity_1 = require("../../entities/subcategory.entity");
const category_entity_1 = require("../../entities/category.entity");
const product_characteristics_entity_1 = require("../../entities/product-characteristics.entity");
const review_entity_1 = require("../../entities/review.entity");
const cart_item_entity_1 = require("../../entities/cart-item.entity");
const order_entity_1 = require("../../entities/order.entity");
const order_item_entity_1 = require("../../entities/order-item.entity");
const cupon_entity_1 = require("../../entities/cupon.entity");
const payment_entity_1 = require("../../entities/payment.entity");
const logger_module_1 = require("../logger/logger.module");
const logger_service_1 = require("../logger/logger.service");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                seller_entity_1.Seller,
                address_entity_1.Address,
                cart_entity_1.Cart,
                cart_item_entity_1.CartItem,
                wishlist_entity_1.Wishlist,
                product_entity_1.Product,
                wishlist_entity_1.Wishlist,
                seller_entity_1.Seller,
                address_entity_1.Address,
                subcategory_entity_1.Subcategory,
                category_entity_1.Category,
                product_characteristics_entity_1.ProductCharacteristic,
                review_entity_1.Review,
                order_entity_1.Order,
                order_item_entity_1.OrderItem,
                cupon_entity_1.Coupon,
                payment_entity_1.Payment
            ]),
            logger_module_1.LoggerModule
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, logger_service_1.LoggerService],
        exports: [users_service_1.UsersService]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map