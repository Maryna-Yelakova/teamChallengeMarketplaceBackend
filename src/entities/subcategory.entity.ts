import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { Product } from "./product.entity";

@Entity("subcategories")
export class Subcategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, cat => cat.subcategories)
  @JoinColumn({ name: "categoryId" })
  parentCategory: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => Subcategory, sub => sub.children, { nullable: true })
  @JoinColumn({ name: "parentSubcategoryId" })
  parentSubcategory?: Subcategory;

  @Column({ nullable: true })
  parentSubcategoryId?: string;

  @OneToMany(() => Subcategory, sub => sub.parentSubcategory)
  children: Subcategory[];

  @OneToMany(() => Product, product => product.subcategory)
  products: Product[];
}
