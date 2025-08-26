import { Body, Controller, Post, HttpCode, Headers, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConsumes,
  ApiProduces,
  ApiQuery,
  ApiHeader,
  ApiTooManyRequestsResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { SendOtpDto } from './dtos/send-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { SendOtpResponseDto } from './dtos/send-otp.response';
import { VerifyOtpResponseDto } from './dtos/verify-otp.response';
import { OtpService } from './otp.service';

@ApiTags('Otp')
@Controller('auth/phone')
export class OtpController {
  constructor(private otp: OtpService) {}

  @Post('send')
  @ApiOperation({ summary: 'Надіслати OTP на телефон', operationId: 'sendPhoneOtp' })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({ type: SendOtpDto })

  // -------- Optional Parameters (will show up in "Parameters") --------
  @ApiQuery({
    name: 'channel',
    required: false,
    enum: ['sms'],
    example: 'sms',
    description: 'Канал відправки OTP',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    example: 'uk',
    description: 'Мова повідомлення (ISO 639-1)',
  })
  @ApiHeader({
    name: 'x-request-id',
    required: false,
    example: 'a1b2c3d4-e5f6-47aa-9b10-112233445566',
    description: 'Кореляційний ID для логування/трасування',
  })

  @ApiCreatedResponse({
    description: 'OTP успішно відправлено',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(SendOtpResponseDto) },
        examples: {
          dev: { value: { ok: true, devHint: '000000' } },
          prod: { value: { ok: true, message: 'OTP sent to +380931234567' } },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Некоректний телефон або інша помилка запиту',
    content: {
      'application/json': {
        examples: {
          badPhone: {
            value: { statusCode: 400, message: 'Phone must be in international format', error: 'Bad Request' },
          },
          limit: {
            value: { statusCode: 400, message: 'Too many requests, try later', error: 'Bad Request' },
          },
        },
      },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Rate limit перевищено',
    content: {
      'application/json': {
        example: { statusCode: 429, message: 'Too many requests', error: 'Too Many Requests' },
      },
    },
  })
  send(
    @Body() dto: SendOtpDto,
    @Query('channel') _channel?: 'sms' | 'call',
    @Query('lang') _lang?: string,
    @Headers('x-request-id') _reqId?: string,
  ) {
    return this.otp.send(dto.phone); // dev: { ok:true, devHint:'000000' }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Перевірити OTP код', operationId: 'verifyPhoneOtp' })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({ type: VerifyOtpDto })
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Результат перевірки OTP',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(VerifyOtpResponseDto) },
        examples: {
          success: { value: { ok: true } },
          alreadyVerified: { value: { ok: false, reason: 'Phone already verified' } },
          invalid: { value: { ok: false, reason: 'Invalid code' } },
          notFound: { value: { ok: false, reason: 'Phone not found' } },
          expired: { value: { ok: false, reason: 'Code not found (expired or not requested)' } },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Помилка валідації (DTO) або бізнес-логіки',
    content: {
      'application/json': {
        examples: {
          badPhone: {
            value: { statusCode: 400, message: 'Phone must be in international format', error: 'Bad Request' },
          },
          badCode: {
            value: { statusCode: 400, message: ['code must be 6 characters'], error: 'Bad Request' },
          },
        },
      },
    },
  })
  async verify(@Body() dto: VerifyOtpDto) {
    const res = await this.otp.verify(dto.phone, dto.code);
    if (!res.ok) return { ok: false, reason: res.reason };
    await this.otp.markPhoneAsValidated(dto.phone);
    return { ok: true };
  }
}


// import { Body, Controller, Post } from '@nestjs/common';
// import { SendOtpDto } from './dtos/send-otp.dto';
// import { VerifyOtpDto } from './dtos/verify-otp.dto';
// import { OtpService } from './otp.service';

// @Controller('auth/phone')
// export class OtpController {
//   constructor(private otp: OtpService) {}

//   @Post('send')
//   send(@Body() dto: SendOtpDto) {
//     return this.otp.send(dto.phone); // у dev поверне { devHint: '000000' }
//   }

//   @Post('verify')
//   async verify(@Body() dto: VerifyOtpDto) {
//     const res = await this.otp.verify(dto.phone, dto.code);
//     if (!res.ok) return { ok:false, reason:res.reason };
    
//     await this.otp.markPhoneAsValidated(dto.phone);
//     return { ok:true };
//   }
// }
