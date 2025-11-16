import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { CartItem } from "./cartItem";
import type { Order } from "./order";
@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  image: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @OneToMany("CartItem", "product", { cascade: true })
  cartItems: CartItem[];

  @Column({ type: "text", nullable: true })
  html: string;

  @Column({ type: "text", nullable: true })
  sanitizedHtml: string;

  @ManyToMany("Order", "products", { cascade: true })
  @JoinTable({
    name: "order_products",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
  })
  orders: Order[];

  @Column({ type: "varchar", length: 500, nullable: true })
  document: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
