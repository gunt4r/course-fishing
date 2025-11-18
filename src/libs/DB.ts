import { DataSource } from 'typeorm';
import { Article } from '../models/article';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartItem';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { User } from '../models/user';
import 'reflect-metadata';

declare global {
  var __COURSE_FISHING_DS__: any;
}
function createDataSource() {
  const entities = [User, Cart, Product, CartItem, Order, Article];

  if (process.env.DATABASE_URL) {
    return new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    });
  }

  return new DataSource({
    type: 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'postgres',
    entities,
    synchronize: true,
    logging: true,
  });
}

export async function getDataSource(): Promise<DataSource> {
    if ((global as any).__COURSE_FISHING_DS__ && (global as any).__COURSE_FISHING_DS__.isInitialized) {
    return (global as any).__COURSE_FISHING_DS__;
  }

  if (!(global as any).__COURSE_FISHING_DS__) {
    (global as any).__COURSE_FISHING_DS__ = createDataSource();
  }

  const ds: DataSource = (global as any).__COURSE_FISHING_DS__;
  if (ds.isInitialized) return ds;

  const maxAttempts = parseInt(process.env.DB_MAX_ATTEMPTS || '0', 10); // 0 = бесконечно
  let attempt = 0;

  while (true) {
    try {
      attempt++;
      await ds.initialize();
      console.log(`✅ DataSource initialized after ${attempt} attempt(s)`);
      return ds;
    } catch (err) {
      console.error(`DB init attempt #${attempt} failed:`, (err as Error).message || err);
      // если maxAttempts > 0 и достигли лимита — пробрасываем ошибку (или можно process.exit)
      if (maxAttempts > 0 && attempt >= maxAttempts) {
        throw err;
      }
      // экспоненциальный бэкофф (до 30s)
      const waitMs = Math.min(30000, 1000 * Math.pow(2, Math.min(attempt, 6)));
      await new Promise((r) => setTimeout(r, waitMs));
      // и повторяем — не выходим из процесса
    }
  }
}
