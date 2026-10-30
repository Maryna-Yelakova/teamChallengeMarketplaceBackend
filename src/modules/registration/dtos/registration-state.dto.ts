import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/** Navigation contract: mobile clients follow this state instead of cached signup form values. */
export class RegistrationStateDto {
  @ApiProperty({ enum: ["PENDING_VERIFICATION", "ACTIVE", "EXPIRED"] })
  accountStatus: "PENDING_VERIFICATION" | "ACTIVE" | "EXPIRED";

  @ApiProperty({ enum: ["buyer", "seller"] })
  accountType: "buyer" | "seller";

  @ApiProperty({ example: { email: "PENDING", phone: "MISSING" } })
  contacts: {
    email: "MISSING" | "PENDING" | "VERIFIED";
    phone: "MISSING" | "PENDING" | "VERIFIED";
  };

  @ApiProperty({ type: [String], example: ["email", "phone"] })
  requiredContactChannels: ("email" | "phone")[];

  @ApiProperty({ type: [String], example: ["phone"] })
  removedContactChannels: ("email" | "phone")[];

  @ApiProperty({ example: { email: "a***@example.com", phone: null } })
  contactHints: { email: string | null; phone: string | null };

  @ApiProperty({
    enum: [
      "VERIFY_EMAIL",
      "VERIFY_PHONE",
      "ADD_CONTACT",
      "REMOVE_UNVERIFIED_CONTACT",
      "REGISTRATION_COMPLETE",
      "REGISTRATION_EXPIRED"
    ]
  })
  nextAction: string;

  @ApiPropertyOptional({ type: String, format: "date-time", nullable: true })
  expiresAt: Date | null;
}
