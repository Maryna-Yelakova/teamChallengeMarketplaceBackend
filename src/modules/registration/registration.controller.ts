import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Public } from "../auth/decorators/public.decorator";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { JwtRegistrationGuard } from "./registration.guard";
import { RegistrationService } from "./registration.service";
import { AddRegistrationContactDto } from "./dtos/add-registration-contact.dto";
import { RegistrationStateDto } from "./dtos/registration-state.dto";
import { ContactAvailabilityGuard } from "./contact-availability.guard";

/** Exposes public availability checks and scoped pending-registration operations. */
@ApiTags("Registration")
@Controller("registration")
@Public()
export class RegistrationController {
  constructor(private readonly registrations: RegistrationService) {}

  @Post("start")
  start(@Body() dto: CreateUserDto) {
    return this.registrations.start(dto);
  }

  @Post("contacts/availability")
  @HttpCode(200)
  @UseGuards(ContactAvailabilityGuard)
  @ApiOperation({ summary: "Check contact availability without creating or reserving an account" })
  @ApiOkResponse({ schema: { type: "object", properties: { available: { type: "boolean" } } } })
  availability(@Body() body: AddRegistrationContactDto) {
    return this.registrations.contactAvailability(body.channel, body.value);
  }

  @Get("state")
  @ApiOkResponse({ type: RegistrationStateDto })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtRegistrationGuard)
  state(@Req() request: Request & { user: { userId: string } }) {
    return this.registrations.state(request.user.userId);
  }

  @Post("contacts")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtRegistrationGuard)
  addContact(
    @Req() request: Request & { user: { userId: string } },
    @Body() body: AddRegistrationContactDto
  ) {
    return this.registrations.addContact(request.user.userId, body.channel, body.value);
  }

  @Delete("contacts/:channel")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtRegistrationGuard)
  removeContact(
    @Req() request: Request & { user: { userId: string } },
    @Param("channel") channel: "email" | "phone"
  ) {
    return this.registrations.removeContact(request.user.userId, channel);
  }
}
