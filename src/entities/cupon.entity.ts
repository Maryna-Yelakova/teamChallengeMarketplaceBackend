import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("coupons")
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  discountType: "percent" | "fixed";

  @Column("decimal")
  discountValue: number;

  @Column({ type: "decimal", nullable: true })
  minOrderAmount?: number;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ nullable: true })
  maxUsageCount?: number;

  @Column({ default: 0 })
  usedCount: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
