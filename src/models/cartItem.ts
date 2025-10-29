import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cart } from "./cart";
import { Product } from "./product";

@Entity({ name: "cart_items" })
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart" })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "products" })
  product: Product;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
