import type { Cart } from './cart';
import type { Product } from './product';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Cart', 'items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart' })
  cart: Cart;

  @ManyToOne('Product', 'cartItems', {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'products' })
  product: Product;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
