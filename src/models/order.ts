import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
} from "typeorm";
import type { User } from "./user";
import type { Product } from "./product";
import { orderStatus } from "@/config/enum";
@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number;

  @ManyToOne("User", "orders", { onDelete: "SET NULL", eager: true })
  user: User;

  @Column({ type: "enum", enum: orderStatus, default: orderStatus.pending })
  status: string;

  @Column({ type: "text", nullable: true })
  paypalOrderId: string;
  
  @ManyToMany("Product", "orders", {
    onDelete: "SET NULL",
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: "order_products",
    joinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
