import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/models/user";
import { Cart } from "@/models/cart";
import { Product } from "@/models/product";
import { CartItem } from "@/models/cartItem";
import { Order } from "@/models/order";
const options = {
  type: "postgres" as const,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Cart, Product, CartItem, Order],
  synchronize: process.env.NODE_ENV !== "production", // dev only
  logging: process.env.NODE_ENV !== "production",
};

export const AppDataSource = new DataSource(options);
export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
