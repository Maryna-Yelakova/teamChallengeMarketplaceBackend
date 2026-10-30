import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./user.entity";

export type RegistrationContactChannel = "email" | "phone";

/**
 * A contact submitted during a pending registration. A partial unique index
 * permits only one current owner while still allowing another registration to
 * keep a candidate claim until OTP proves ownership.
 */
@Entity({ name: "registration_contacts" })
@Index("registration_contacts_one_owner_idx", ["channel", "normalizedValue"], {
  unique: true,
  where: '"is_owner" = true AND "is_removed" = false'
})
@Index("registration_contacts_user_channel_idx", ["userId", "channel"])
export class RegistrationContact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 10 })
  channel: RegistrationContactChannel;

  @Column({ type: "varchar", length: 320 })
  value: string;

  @Column({ type: "varchar", length: 320, name: "normalized_value" })
  normalizedValue: string;

  @Column({ type: "boolean", default: false, name: "is_verified" })
  isVerified: boolean;

  @Column({ type: "boolean", default: false, name: "is_owner" })
  isOwner: boolean;

  @Column({ type: "boolean", default: false, name: "is_removed" })
  isRemoved: boolean;

  /** Distinguishes a lost claim from an unverified candidate awaiting OTP. */
  @Column({ type: "boolean", default: false, name: "is_transferred" })
  isTransferred: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
