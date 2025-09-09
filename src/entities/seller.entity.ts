import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "./user.entity";
import { Product } from "./product.entity";
import { Review } from "./review.entity";

@Entity("sellers")
export class Seller {
  @ApiProperty({ format: "uuid", description: "Unique identifier for the seller" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.sellers)
  @JoinColumn({ name: "userId" })
  user: User;

  @ApiProperty({ description: "User ID of the seller", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" })
  @Column()
  userId: string;

  @ApiProperty({ description: "Name of the shop", example: "My Amazing Shop" })
  @Column()
  shopName: string;

  @ApiProperty({ required: false, description: "Legal address of the seller", example: "123 Main St, Kiev, Ukraine" })
  @Column({ nullable: true })
  legalAddress?: string;

  @ApiProperty({ required: false, description: "Tax identification number", example: "12345678901" })
  @Column({ nullable: true })
  taxId?: string;

  @ApiProperty({ required: false, description: "Phone number", example: "+380991234567" })
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ required: false, description: "Description of the seller's business", example: "We sell quality products" })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: "Date when seller was created" })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  @OneToMany(() => Review, review => review.seller)
  reviews: Review[];
}
