import type { NextRequest, NextResponse } from 'next/server';
import type { Product } from '@/models/product';
import { orderStatus } from '@/config/enum';
import { getDataSource } from '@/libs/DB';
import { Order } from '@/models/order';
import { User } from '@/models/user';
import { getOrCreateCartForRequest, clearCart } from '../cart/service';
import { getProductById } from '../product/service';
import { getUserByEmail, getUserById, getUserIdFromRequest, registration } from '../users/service';

export async function createOrder(
  data: any,
  request: NextRequest,
  response: NextResponse,
) {
  const dataSource = await getDataSource();
  const orderRepo = dataSource.getRepository(Order);
  const { phone, email, password } = data;
  const userId = getUserIdFromRequest(request);
  if (!phone || !email) {
    throw new Error('Phone and email are required');
  }
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (phone.length < 5) {
    throw new Error('Invalid phone number');
  }
  if (!/^\+?\d+$/.test(phone)) {
    throw new Error('Invalid phone number');
  }

  try {
    let user;
    let isRegisteredUser = false;

    if (userId) {
      const existingUser = await getUserById(userId);

      if (existingUser && existingUser.email && existingUser.password) {
        isRegisteredUser = true;
        user = existingUser;

        let needsUpdate = false;
        if (user.phone !== phone) {
          user.phone = phone;
          needsUpdate = true;
        }
        if (user.email !== email) {
          user.email = email;
          needsUpdate = true;
        }
        if (needsUpdate) {
          await dataSource.getRepository(User).save(user);
        }
      }
    }

    if (!isRegisteredUser) {
      if (!password) {
        throw new Error('Password is required for registration');
      }
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists. Please login.');
      }

      user = await registration({ email, password, phone });
      if (!user) {
        throw new Error('User registration failed');
      }
    }

    const cartData = await getOrCreateCartForRequest(request, response);
    if (!cartData) {
      throw new Error('Cart not found');
    }
    if (!cartData.items || !cartData.items.length) {
      throw new Error('Cart items not found');
    }

    const products: Product[] = [];
    for (const item of cartData.items) {
      if (!item.product) {
        throw new Error('Product not found');
      }
      products.push(item.product);
    }

    const order = orderRepo.create({
      user,
      totalAmount: cartData.totalPrice,
      products,
      status: orderStatus.pending,
    });

    await orderRepo.save(order);
    await clearCart(cartData.id);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function createOrderServer(data: any) {
  const dataSource = await getDataSource();
  const orderRepo = dataSource.getRepository(Order);
  try {
    const { userId, products, totalAmount, status } = data;
    if (!userId) {
      throw new Error('User id is required');
    }
    if (!products || !products.length) {
      throw new Error('Products are required');
    }
    if (!totalAmount) {
      throw new Error('Total amount is required');
    }
    const user = await getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const productsToSave: Product[] = [];
    for (const product of products) {
      if (!product.id) {
        throw new Error('Product id is required');
      }
      const productToSave = await getProductById(product.id);
      if (!productToSave) {
        throw new Error('Product not found');
      }
      productsToSave.push(productToSave);
    }
    const order = orderRepo.create({
      user,
      totalAmount,
      products: productsToSave,
      status,
    });
    await orderRepo.save(order);
    return order;
  } catch (error) {
    throw error;
  }
}
export async function deleteOrder(id: string): Promise<void> {
  const dataSource = await getDataSource();
  const orderRepo = dataSource.getRepository(Order);
  try {
    const order = await orderRepo.findOneBy({ id });
    if (!order) {
      throw new Error('Order not found');
    }
    await orderRepo.remove(order);
  } catch (error) {
    throw error;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const dataSource = await getDataSource();
  const orderRepo = dataSource.getRepository(Order);
  try {
    const orders = await orderRepo.find({
      order: { createdAt: 'DESC' },
    });
    if (!orders) {
      throw new Error('Orders not found');
    }
    return orders;
  } catch (error) {
    throw error;
  }
}

export async function getOrderById(id: string): Promise<Order> {
  const dataSource = await getDataSource();
  const orderRepo = dataSource.getRepository(Order);

  try {
    const order = await orderRepo.findOne({
      where: { id },
      relations: ['user', 'products'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    throw error;
  }
}

export async function updateOrder(id: string, data: any): Promise<Order> {
  const dataSource = await getDataSource();
  const orderRepo = dataSource.getRepository(Order);
  try {
    const order = await orderRepo.findOneBy({ id });
    if (!order) {
      throw new Error('Order not found');
    }
    Object.assign(order, data);
    await orderRepo.save(order);
    return order;
  } catch (error) {
    throw error;
  }
}
