import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { CartItem } from "./cartItem";

@Entity({ name: "carts" })
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: true })
  userId: string | null;

  @OneToOne(() => User, (user) => user.cart, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User | null;

  @Column({ type: "varchar", length: 255, nullable: true, unique: true })
  sessionId: string | null;

  @OneToMany("CartItem", "cart", {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  @Column({ type: "varchar", length: 50, nullable: true })
  couponCode: string | null;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + Number(item.price), 0);
  }

  getDiscount(): number {
    return (this.getSubtotal() * Number(this.discountPercent)) / 100;
  }

  getTotal(): number {
    return this.getSubtotal() - this.getDiscount();
  }
}
