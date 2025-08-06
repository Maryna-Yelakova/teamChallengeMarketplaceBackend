import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { User } from "./user.entity";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.addresses)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  title?: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  region?: string;

  @Column()
  street: string;

  @Column({ nullable: true })
  building?: string;

  @Column({ nullable: true })
  apartment?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
