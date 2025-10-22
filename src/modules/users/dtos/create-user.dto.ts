import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, IsOptional, IsBoolean } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: "User's first name", example: "Василь" })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "User's phone number", example: "+380991234567" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+\d{10,15}$/, {
    message: "Phone number must be in international format, e.g. +12345678901"
  })
  phone: string;

  @IsEmail({}, { message: "Invalid email format" })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Email must contain only Latin characters"
  })
  @ApiProperty({ description: "User's email", example: "basilbasilyuk@mail.gov" })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "User's password", example: "mysecretword" })
  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword()
  @Length(6, 20)
  password: string;

  @ApiProperty({ required: false, description: "Whether user's phone is validated", example: false })
  @IsOptional()
  @IsBoolean()
  isPhoneValidated?: boolean;
}
