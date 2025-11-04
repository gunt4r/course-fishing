import { getDataSource } from "@/libs/DB";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product";
import { getOrCreateCartForRequest } from "../cart/service";
import { registration } from "../users/service";
import { Order } from "@/models/order";
export async function createOrder(
  data: any,
  request: NextRequest,
  response: NextResponse,
) {
  const dataSource = await getDataSource();
  const orderRepo = dataSource.getRepository(Order);
  const { phone, email, password } = data;
  if (!phone || !email || !password) {
    throw new Error("Phone, email and password are required");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!email.includes("@")) {
    throw new Error("Invalid email");
  }
  if (phone.length < 5) {
    throw new Error("Invalid phone number");
  }
  if (!/^\+?\d+$/.test(phone)) {
    throw new Error("Invalid phone number");
  }
  try {
    const user = await registration({ email, password, phone });
    if (!user) {
      throw new Error("User registration failed");
    }
    const cartData = await getOrCreateCartForRequest(request, response);
    if (!cartData) {
      throw new Error("Cart not found");
    }
    if (!cartData.items || !cartData.items.length) {
      throw new Error("Cart items not found");
    }
    const products: Product[] = [];
    for (const item of cartData.items) {
      if (!item.product) {
        throw new Error(`Item with id ${item.id} has no product`);
      }
      products.push(item.product);
    }
    const order = orderRepo.create({
      user,
      totalAmount: cartData.totalPrice,
      products,
    });
    await orderRepo.save(order);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
