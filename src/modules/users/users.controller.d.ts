import { UsersService } from "./users.service";
import { UpdateUsersDto } from "./dtos/update-user.dto";
import { ChangePhoneDto } from "./dtos/change-phone.dto";
import { AppAbility } from "src/modules/casl/casl-ability.types";
import { RequestWithUser } from "src/common/types";
import { ChangePasswordDto } from "../auth/dtos/change-password.dto";
export declare class UsersController {
    private UsersService;
    constructor(UsersService: UsersService);
    getUserById(id: string, ability: AppAbility): Promise<{
        id: string;
        firstName: string;
        middleName?: string;
        lastName?: string;
        birthDay?: Date;
        phone: string;
        isPhoneValidated: boolean;
        email: string;
        isEmailValidated: boolean;
        isSeller: boolean;
        sellers: import("../../entities/seller.entity").Seller[];
        addresses: import("../../entities/address.entity").Address[];
        carts: import("../../entities/cart.entity").Cart[];
        wishlists: import("../../entities/wishlist.entity").Wishlist[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    isEmailPresent(email: string): Promise<{
        isPresent: boolean;
    }>;
    isPhonePresent(phone: string): Promise<{
        isPresent: boolean;
    }>;
    delete(id: string, ability: AppAbility): Promise<void>;
    updateUser(id: string, updateUserDto: UpdateUsersDto, ability: AppAbility): Promise<import("../../entities/user.entity").User | undefined>;
    changePhone(id: string, changePhoneDto: ChangePhoneDto, ability: AppAbility): Promise<{
        id: string;
        firstName: string;
        middleName?: string;
        lastName?: string;
        birthDay?: Date;
        phone: string;
        isPhoneValidated: boolean;
        email: string;
        isEmailValidated: boolean;
        isSeller: boolean;
        sellers: import("../../entities/seller.entity").Seller[];
        addresses: import("../../entities/address.entity").Address[];
        carts: import("../../entities/cart.entity").Cart[];
        wishlists: import("../../entities/wishlist.entity").Wishlist[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(req: RequestWithUser, dto: ChangePasswordDto, ability: AppAbility): Promise<{
        message: string;
    }>;
}
