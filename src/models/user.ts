import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Cart } from "./cart";
import { Role } from "@/config/enum";
import type { Order } from "./order";
@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 255, unique: true })
  phone: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role: string;

  @OneToOne(() => Cart, (cart) => cart.user, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @OneToMany("Order", "user", { cascade: true, nullable: true })
  orders: Order[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
