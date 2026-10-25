import { IsOptional, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
/** Legacy optional input; the pending session determines the actual OTP destination. */
export class SendOtpDto {
  @ApiProperty({
    required: false,
    example: "+380931234567",
    description: "Phone number у міжнародному форматі (E.164)"
  })
  @IsOptional()
  @Matches(/^\+\d{10,15}$/, { message: "Phone must be in international format" })
  phone?: string;
}
