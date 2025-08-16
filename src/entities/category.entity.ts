import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subcategory } from "./subcategory.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("categories")
export class Category {
  @ApiProperty({ format: "uuid", description: "Unique identifier for the category" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Subcategory, sub => sub.category)
  subcategories: Subcategory[];
}
