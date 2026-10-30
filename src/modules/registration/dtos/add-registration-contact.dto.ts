import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString, MaxLength } from "class-validator";

/** The service validates and normalizes the value according to the selected channel. */
export class AddRegistrationContactDto {
  @ApiProperty({ enum: ["email", "phone"] })
  @IsIn(["email", "phone"])
  channel: "email" | "phone";

  @ApiProperty({ example: "+390000000001 or name@example.com" })
  @IsString()
  @MaxLength(320)
  value: string;
}
