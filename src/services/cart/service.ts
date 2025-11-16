import type { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/libs/DB';
import { Cart } from '@/models/cart';
import { CartItem } from '@/models/cartItem';
import { Product } from '@/models/product';
import {
  ensureSessionCookie,
  getUserIdFromRequest,
  getUserIdFromToken,
} from '../users/service';

export async function getCartById(cartId: string): Promise<Cart | null> {
  const dataSource = await getDataSource();
  const cartRepo = dataSource.getRepository(Cart);
  try {
    const cart = await cartRepo.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      return null;
    }
    return cart;
  } catch (error) {
    throw error;
  }
}

export const getOrCreateCartForRequest = async (
  request: NextRequest,
  response: NextResponse,
) => {
  const dataSource = await getDataSource();
  const cartRepo = dataSource.getRepository(Cart);

  const userId = getUserIdFromRequest(request);
  if (userId) {
    let cart = await cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      cart = cartRepo.create({ userId, items: [] });
      await cartRepo.save(cart);
      cart = (await cartRepo.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],
      })) as Cart;
    }
    const totalPrice = getTotalPrice(cart);
    return { ...cart, totalPrice };
  }

  const sessionId = ensureSessionCookie(request, response);
  let cart = await cartRepo.findOne({
    where: { sessionId },
    relations: ['items', 'items.product'],
  });
  if (!cart) {
    cart = cartRepo.create({ sessionId, items: [] });
    await cartRepo.save(cart);
    cart = (await cartRepo.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product'],
    })) as Cart;
  }
  const totalPrice = getTotalPrice(cart);
  return { ...cart, totalPrice };
};
export const getOrCreateCartServer = async (
  sessionId: string,
  token: string,
) => {
  const dataSource = await getDataSource();
  const cartRepo = dataSource.getRepository(Cart);

  const userId = getUserIdFromToken(token);
  if (userId) {
    let cart = await cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      cart = cartRepo.create({ userId, items: [] });
      await cartRepo.save(cart);
      cart = (await cartRepo.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],
      })) as Cart;
    }
    const totalPrice = getTotalPrice(cart);
    return { ...cart, totalPrice };
  }

  let cart = await cartRepo.findOne({
    where: { sessionId },
    relations: ['items', 'items.product'],
  });
  if (!cart) {
    cart = cartRepo.create({ sessionId, items: [] });
    await cartRepo.save(cart);
    cart = (await cartRepo.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product'],
    })) as Cart;
  }
  const totalPrice = getTotalPrice(cart);
  return { ...cart, totalPrice };
};

export const addToCart = async (
  request: NextRequest,
  response: NextResponse,
  productId: string,
) => {
  const dataSource = await getDataSource();
  const productRepo = dataSource.getRepository(Product);
  const itemRepo = dataSource.getRepository(CartItem);

  const product = await productRepo.findOneBy({ id: productId });
  if (!product) {
    throw new Error('Product not found');
  }

  const cart = await getOrCreateCartForRequest(request, response);
  const priceValue
    = typeof product.price === 'string' ? Number(product.price) : product.price;
  if (priceValue === undefined || Number.isNaN(priceValue)) {
    throw new Error('Product has invalid price');
  }

  const item = itemRepo.create({
    cart,
    product,
    price: priceValue,
  });
  await itemRepo.save(item);

  const updatedCart = await dataSource
    .getRepository(Cart)
    .findOne({ where: { id: cart.id }, relations: ['items', 'items.product'] });
  return { cart: updatedCart as Cart };
};

export async function deleteItemFromCart(
  request: NextRequest,
  response: NextResponse,
  productId: string,
): Promise<void> {
  const dataSource = await getDataSource();
  const itemRepo = dataSource.getRepository(CartItem);
  try {
    const cart = await getOrCreateCartForRequest(request, response);
    if (!cart) {
      throw new Error('Cart not found');
    }
    if (!cart.items) {
      throw new Error('Cart items not found');
    }
    const itemToDelete = cart.items.find(
      item => item.product.id === productId,
    );
    if (!itemToDelete) {
      throw new Error(`Item with id ${productId} not found in cart`);
    }
    await itemRepo.delete({ id: itemToDelete.id });
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    throw error;
  }
}
export const mergeGuestCartIntoUser = async (
  request: NextRequest,
  response: NextResponse,
) => {
  const dataSource = await getDataSource();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    throw new Error(
      'User not authenticated — cannot merge guest cart into user cart.',
    );
  }

  const cookieName = (process.env.NAME_SESSION_ID as string) || 'sessionId';

  return await dataSource.transaction(async (em) => {
    const cartRepository = em.getRepository(Cart);
    const itemRepository = em.getRepository(CartItem);

    const sessionId = request.cookies.get(cookieName)?.value;
    if (!sessionId) {
      let userCart = await cartRepository.findOne({
        where: { userId },
        relations: ['items', 'items.product'],
      });
      if (!userCart) {
        userCart = cartRepository.create({ userId, items: [] });
        await cartRepository.save(userCart);
        userCart = (await cartRepository.findOne({
          where: { id: userCart.id },
          relations: ['items', 'items.product'],
        })) as Cart;
      }
      return userCart;
    }

    const guestCart = await cartRepository.findOne({
      where: { sessionId },
      relations: ['items', 'items.product'],
    });
    if (!guestCart || !guestCart.items?.length) {
      response.cookies.set({
        name: cookieName,
        value: '',
        path: '/',
        maxAge: 0,
      });
      let userCart = await cartRepository.findOne({
        where: { userId },
        relations: ['items', 'items.product'],
      });
      if (!userCart) {
        userCart = cartRepository.create({ userId, items: [] });
        await cartRepository.save(userCart);
        userCart = (await cartRepository.findOne({
          where: { id: userCart.id },
          relations: ['items', 'items.product'],
        })) as Cart;
      }
      return userCart;
    }

    let userCart = await cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
    if (!userCart) {
      userCart = cartRepository.create({ userId, items: [] });
      await cartRepository.save(userCart);
      userCart = (await cartRepository.findOne({
        where: { id: userCart.id },
        relations: ['items', 'items.product'],
      })) as Cart;
    }

    const userMap = new Map<string, CartItem>();
    for (const userItem of userCart.items || []) {
      const key = `${userItem.product.id}`;
      userMap.set(key, userItem);
    }

    for (const guestItem of guestCart.items || []) {
      const guestPrice
        = guestItem.price !== undefined && guestItem.price !== null
          ? typeof guestItem.price === 'string'
            ? Number(guestItem.price)
            : guestItem.price
          : typeof guestItem.product.price === 'string'
            ? Number(guestItem.product.price)
            : guestItem.product.price;

      if (guestPrice === undefined || Number.isNaN(guestPrice)) {
        throw new Error('Invalid price on guest item or product');
      }

      const newItem = itemRepository.create({
        cart: userCart,
        product: guestItem.product,
        price: guestPrice,
      });
      await itemRepository.save(newItem);
    }

    await itemRepository.delete({ cart: guestCart });
    await cartRepository.delete({ id: guestCart.id });

    response.cookies.set({ name: cookieName, value: '', path: '/', maxAge: 0 });

    const merged = await cartRepository.findOne({
      where: { id: userCart.id },
      relations: ['items', 'items.product'],
    });
    return merged;
  });
};

export function getTotalPrice(cart: Cart): number {
  return cart.items.reduce((total, item) => {
    const itemPrice
      = typeof item.price === 'string' ? Number(item.price) : item.price;
    return total + (itemPrice || 0);
  }, 0);
}

export async function clearCart(cartId: string) {
  const dataSource = await getDataSource();
  const itemRepo = dataSource.getRepository(CartItem);
  try {
    await itemRepo.delete({ cart: { id: cartId } });
  } catch (error) {
    throw error;
  }
}
export async function clearCarts() {
  const dataSource = await getDataSource();
  const itemRepo = dataSource.getRepository(CartItem);
  try {
    await itemRepo.clear();
  } catch (error) {
    throw error;
  }
}
