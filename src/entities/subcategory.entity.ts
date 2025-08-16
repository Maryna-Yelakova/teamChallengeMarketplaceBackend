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

  @ApiProperty({ description: "Parent category" })
  @ManyToOne(() => Category, category => category.subcategories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ApiProperty({ description: "Category ID", format: "uuid" })
  @Column()
  categoryId: string;

  @ApiProperty({
    description: "Parent subcategory (for nesting)",
    required: false,
    type: () => Subcategory
  })
  @ManyToOne(() => Subcategory, subcategory => subcategory.children, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "parentSubcategoryId" })
  parentSubcategory?: Subcategory;

  @ApiProperty({ description: "Parent subcategory ID", format: "uuid", required: false })
  @Column({ nullable: true })
  parentSubcategoryId?: string;

  @ApiProperty({ description: "List of child subcategories", type: () => [Subcategory] })
  @OneToMany(() => Subcategory, subcategory => subcategory.parentSubcategory)
  children: Subcategory[];

  @ApiProperty({ description: "List of products in this subcategory", type: () => [Product] })
  @OneToMany(() => Product, product => product.subcategory)
  products: Product[];
}
