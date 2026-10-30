import { MigrationInterface, QueryRunner } from "typeorm";

/** Adds claims and refresh sessions while preserving existing profiles as active accounts. */
export class AddResumableRegistration1761190000000 implements MigrationInterface {
  name = "AddResumableRegistration1761190000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`);
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "registrationStatus" character varying(32) NOT NULL DEFAULT 'ACTIVE',
      ADD COLUMN "registrationExpiresAt" TIMESTAMPTZ,
      ADD COLUMN "lastMeaningfulActivityAt" TIMESTAMPTZ,
      ADD COLUMN "tokenVersion" integer NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      CREATE TABLE "registration_contacts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "channel" character varying(10) NOT NULL,
        "value" character varying(320) NOT NULL,
        "normalized_value" character varying(320) NOT NULL,
        "is_verified" boolean NOT NULL DEFAULT false,
        "is_owner" boolean NOT NULL DEFAULT false,
        "is_removed" boolean NOT NULL DEFAULT false,
        "is_transferred" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_registration_contacts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_registration_contacts_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_registration_contacts_channel"
          CHECK ("channel" IN ('email', 'phone')),
        CONSTRAINT "UQ_registration_contacts_user_channel_value"
          UNIQUE ("user_id", "channel", "normalized_value")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "refresh_token_sessions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "token_id" uuid NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_token_sessions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_refresh_token_sessions_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "refresh_token_sessions_token_id_idx" ON "refresh_token_sessions" ("token_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "refresh_token_sessions_user_id_idx" ON "refresh_token_sessions" ("user_id")`
    );
    await queryRunner.query(`
      CREATE UNIQUE INDEX "registration_contacts_one_owner_idx"
      ON "registration_contacts" ("channel", "normalized_value")
      WHERE "is_owner" = true AND "is_removed" = false
    `);
    await queryRunner.query(`
      CREATE INDEX "registration_contacts_user_channel_idx"
      ON "registration_contacts" ("user_id", "channel")
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT lower("email") FROM "users" WHERE "email" IS NOT NULL GROUP BY lower("email") HAVING COUNT(*) > 1) THEN
          RAISE EXCEPTION 'Cannot migrate duplicate normalized emails in users';
        END IF;
        IF EXISTS (SELECT regexp_replace("phone", '[[:space:]()-]', '', 'g') FROM "users" WHERE "phone" IS NOT NULL GROUP BY regexp_replace("phone", '[[:space:]()-]', '', 'g') HAVING COUNT(*) > 1) THEN
          RAISE EXCEPTION 'Cannot migrate duplicate normalized phones in users';
        END IF;
      END $$
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM "users" WHERE "phone" IS NOT NULL
          GROUP BY "phone" HAVING COUNT(*) > 1
        ) THEN
          RAISE EXCEPTION 'Cannot add unique phone index: duplicate user phone values exist';
        END IF;
      END $$
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "users_phone_unique_idx"
      ON "users" ("phone") WHERE "phone" IS NOT NULL
    `);

    // Preserve existing accounts as active; new registrations explicitly opt into pending.
    await queryRunner.query(`UPDATE "users" SET "registrationStatus" = 'ACTIVE'`);
    await queryRunner.query(`
      INSERT INTO "registration_contacts" ("user_id", "channel", "value", "normalized_value", "is_verified", "is_owner")
      SELECT "id", 'email', "email", lower("email"), "isEmailValidated", true
      FROM "users" WHERE "email" IS NOT NULL
      ON CONFLICT ("user_id", "channel", "normalized_value") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "registration_contacts" ("user_id", "channel", "value", "normalized_value", "is_verified", "is_owner")
      SELECT "id", 'phone', "phone", regexp_replace("phone", '[[:space:]()-]', '', 'g'), "isPhoneValidated", true
      FROM "users" WHERE "phone" IS NOT NULL
      ON CONFLICT ("user_id", "channel", "normalized_value") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM "users" WHERE "email" IS NULL OR "phone" IS NULL) THEN
          RAISE EXCEPTION 'Cannot revert registration migration while nullable contact data exists';
        END IF;
      END $$
    `);
    await queryRunner.query(`DROP INDEX IF EXISTS "users_phone_unique_idx"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "refresh_token_sessions_user_id_idx"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "refresh_token_sessions_token_id_idx"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_token_sessions"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "registration_contacts_user_channel_idx"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "registration_contacts_one_owner_idx"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "registration_contacts"`);
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "lastMeaningfulActivityAt",
      DROP COLUMN IF EXISTS "registrationExpiresAt",
      DROP COLUMN IF EXISTS "registrationStatus",
      DROP COLUMN IF EXISTS "tokenVersion"
    `);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`);
  }
}
