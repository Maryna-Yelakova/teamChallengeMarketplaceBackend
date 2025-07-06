import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  birthDay?: Date;

  @Column()
  phone: string;

  @Column({ default: false })
  isPhoneValidated: boolean;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailValideted: boolean;

  @Column()
  password: string;
}
