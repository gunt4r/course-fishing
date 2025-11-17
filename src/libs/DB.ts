import { DataSource } from 'typeorm';
import { Article } from '@/models/article';
import { Cart } from '@/models/cart';
import { CartItem } from '@/models/cartItem';
import { Order } from '@/models/order';
import { Product } from '@/models/product';
import { User } from '@/models/user';
import 'reflect-metadata';

const options = process.env.DATABASE_URL
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      entities: [User, Cart, Product, CartItem, Order, Article],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'postgres',
      entities: [User, Cart, Product, CartItem, Order, Article],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    };

export const AppDataSource = new DataSource(options);
export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
