import { Matches, Length } from 'class-validator';
export class VerifyOtpDto {
  @Matches(/^\+\d{10,15}$/, { message: "Phone must be in international format" })
  phone!: string;
  @Length(6, 6) code!: string;
}