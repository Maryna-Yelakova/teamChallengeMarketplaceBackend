import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { Product } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("subcategories")
export class Subcategory {
  @ApiProperty({ description: "Unique identifier", format: "uuid" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Subcategory name" })
  @Column()
  name: string;

  @ManyToOne(() => Category, category => category.subcategories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ApiProperty({ description: "Category ID", format: "uuid", example: "181fe998-8066-41e1-989b-71cd9a085a55" })
  @Column()
  categoryId: string;

  @ManyToOne(() => Subcategory, subcategory => subcategory.children, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "parentSubcategoryId" })
  parentSubcategory?: Subcategory;

  @ApiProperty({ description: "Parent subcategory ID", format: "uuid", required: false, example: "181fe998-8066-41e1-989b-71cd9a085a55" })
  @Column({ nullable: true })
  parentSubcategoryId?: string;

  @OneToMany(() => Subcategory, subcategory => subcategory.parentSubcategory)
  children: Subcategory[];

  @OneToMany(() => Product, product => product.subcategory)
  products: Product[];
}
