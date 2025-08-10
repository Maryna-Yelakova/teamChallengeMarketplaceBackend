import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ChangePhoneDto {
  @ApiProperty({ 
    description: "New phone number", 
    example: "+380991234567",
    pattern: "^\\+380\\d{9}$"
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+380\d{9}$/, {
    message: "Phone number must be in format +380XXXXXXXXX"
  })
  newPhone: string;
}