import { getDataSource } from "@/libs/DB";
import { Cart } from "@/models/cart";
import { CartItem } from "@/models/cartItem";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product";
import { getUserIdFromRequest, ensureSessionCookie } from "../users/service";

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
      relations: ["items", "items.product"],
    });
    if (!cart) {
      cart = cartRepo.create({ userId, items: [] });
      await cartRepo.save(cart);
      cart = (await cartRepo.findOne({
        where: { id: cart.id },
        relations: ["items", "items.product"],
      })) as Cart;
    }
    return cart;
  }

  const sessionId = ensureSessionCookie(request, response);
  let cart = await cartRepo.findOne({
    where: { sessionId },
    relations: ["items", "items.product"],
  });
  if (!cart) {
    cart = cartRepo.create({ sessionId, items: [] });
    await cartRepo.save(cart);
    cart = (await cartRepo.findOne({
      where: { id: cart.id },
      relations: ["items", "items.product"],
    })) as Cart;
  }
  return cart;
};

export const addToCart = async (
  request: NextRequest,
  response: NextResponse,
  productId: string,
  quantity = 1,
) => {
  if (quantity <= 0) throw new Error("Quantity must be >= 1");

  const dataSource = await getDataSource();
  const productRepo = dataSource.getRepository(Product);
  const itemRepo = dataSource.getRepository(CartItem);

  const product = await productRepo.findOneBy({ id: productId });
  if (!product) throw new Error("Product not found");

  const cart = await getOrCreateCartForRequest(request, response);

  const item = itemRepo.create({
    cart: cart,
    product: product,
  });
  await itemRepo.save(item);

  const updatedCart = await dataSource
    .getRepository(Cart)
    .findOne({ where: { id: cart.id }, relations: ["items", "items.product"] });
  return { cart: updatedCart as Cart };
};

export const mergeGuestCartIntoUser = async (
  request: NextRequest,
  response: NextResponse,
) => {
  const dataSource = await getDataSource();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    throw new Error(
      "User not authenticated — cannot merge guest cart into user cart.",
    );
  }

  const cookieName = (process.env.NAME_SESSION_ID as string) || "sessionId";

  return await dataSource.transaction(async (em) => {
    const cartRepository = em.getRepository(Cart);
    const itemRepository = em.getRepository(CartItem);

    const sessionId = request.cookies.get(cookieName)?.value;
    if (!sessionId) {
      let userCart = await cartRepository.findOne({
        where: { userId },
        relations: ["items", "items.product"],
      });
      if (!userCart) {
        userCart = cartRepository.create({ userId, items: [] });
        await cartRepository.save(userCart);
        userCart = (await cartRepository.findOne({
          where: { id: userCart.id },
          relations: ["items", "items.product"],
        })) as Cart;
      }
      return userCart;
    }

    const guestCart = await cartRepository.findOne({
      where: { sessionId },
      relations: ["items", "items.product"],
    });
    if (!guestCart || !guestCart.items?.length) {
      response.cookies.set({
        name: cookieName,
        value: "",
        path: "/",
        maxAge: 0,
      });
      let userCart = await cartRepository.findOne({
        where: { userId },
        relations: ["items", "items.product"],
      });
      if (!userCart) {
        userCart = cartRepository.create({ userId, items: [] });
        await cartRepository.save(userCart);
        userCart = (await cartRepository.findOne({
          where: { id: userCart.id },
          relations: ["items", "items.product"],
        })) as Cart;
      }
      return userCart;
    }

    let userCart = await cartRepository.findOne({
      where: { userId },
      relations: ["items", "items.product"],
    });
    if (!userCart) {
      userCart = cartRepository.create({ userId, items: [] });
      await cartRepository.save(userCart);
      userCart = (await cartRepository.findOne({
        where: { id: userCart.id },
        relations: ["items", "items.product"],
      })) as Cart;
    }

    const userMap = new Map<string, CartItem>();
    for (const userItem of userCart.items || []) {
      const key = `${userItem.product.id}`;
      userMap.set(key, userItem);
    }

    for (const guestItem of guestCart.items || []) {
      const newItem = itemRepository.create({
        cart: userCart,
        product: guestItem.product,
      });
      await itemRepository.save(newItem);
    }

    await itemRepository.delete({ cart: guestCart });
    await cartRepository.delete({ id: guestCart.id });

    response.cookies.set({ name: cookieName, value: "", path: "/", maxAge: 0 });

    const merged = await cartRepository.findOne({
      where: { id: userCart.id },
      relations: ["items", "items.product"],
    });
    return merged;
  });
};
