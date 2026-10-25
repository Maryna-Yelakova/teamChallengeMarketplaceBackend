import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";

/** Stores refresh token IDs so rotation and logout can revoke previously issued tokens. */
@Entity({ name: "refresh_token_sessions" })
@Index("refresh_token_sessions_token_id_idx", ["tokenId"], { unique: true })
@Index("refresh_token_sessions_user_id_idx", ["userId"])
export class RefreshTokenSession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "uuid", name: "token_id" })
  tokenId: string;

  @Column({ type: "timestamptz", name: "expires_at" })
  expiresAt: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
