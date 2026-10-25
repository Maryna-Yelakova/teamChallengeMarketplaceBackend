import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { User } from "../../../entities/user.entity";

/** Fields returned by user profile endpoints. Database relations and password stay private. */
export class UserResponseDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  middleName?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  lastName?: string | null;

  @ApiPropertyOptional({ type: String, format: "date-time", nullable: true })
  birthDay?: Date | null;

  /** A buyer may activate with only email, so the other contact can remain null. */
  @ApiPropertyOptional({ type: String, nullable: true })
  phone: string | null;

  @ApiProperty()
  isPhoneValidated: boolean;

  /** A buyer may activate with only phone, so the other contact can remain null. */
  @ApiPropertyOptional({ type: String, nullable: true })
  email: string | null;

  @ApiProperty()
  isEmailValidated: boolean;

  @ApiProperty()
  isSeller: boolean;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date;

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt: Date;
}

type UserResponseSource = Pick<
  User,
  | "id"
  | "firstName"
  | "middleName"
  | "lastName"
  | "birthDay"
  | "phone"
  | "isPhoneValidated"
  | "email"
  | "isEmailValidated"
  | "isSeller"
  | "createdAt"
  | "updatedAt"
>;

/** Copy only approved fields, including when the source is a full User entity. */
export function toUserResponse(user: UserResponseSource): UserResponseDto {
  return {
    id: user.id,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    birthDay: user.birthDay,
    phone: user.phone,
    isPhoneValidated: user.isPhoneValidated,
    email: user.email,
    isEmailValidated: user.isEmailValidated,
    isSeller: user.isSeller,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
