import { Matches } from 'class-validator';
export class SendOtpDto { 
  @Matches(/^\+\d{10,15}$/, { message: "Phone must be in international format" })
  phone!: string; 
}

