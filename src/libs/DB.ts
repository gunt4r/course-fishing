import { DataSource } from 'typeorm';
import { Article } from '../models/article';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartItem';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { User } from '../models/user';
import 'reflect-metadata';

let dataSource: DataSource | null = null;

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
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  });
}

export async function getDataSource() {
  if (!dataSource) {
    dataSource = createDataSource();
  }

  if (!dataSource.isInitialized) {
    try {
      console.log('🔌 Connecting to database...');
      console.log('📍 Connection details:', {
        type: dataSource.options.type,
        database: dataSource.options.database || 'from URL',
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      });

      await dataSource.initialize();
      console.log('✅ Database connected successfully');
      console.log('📊 Entities:', dataSource.entityMetadatas.map(e => e.tableName));
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message);
      console.error('Full error:', error);
      throw error;
    }
  }

  return dataSource;
}
