import { NextResponse, NextRequest } from "next/server";
import {
  getOrCreateCartForRequest,
  addToCart as addToCartService,
  mergeGuestCartIntoUser,
} from "@/services/cart/service";

const COOKIE_NAMES_TO_COPY = [
  (process.env.NAME_SESSION_ID as string) || "sessionId",
  "token",
];

async function copyCookies(from: NextResponse, to: NextResponse) {
  for (const name of COOKIE_NAMES_TO_COPY) {
    try {
      const c = from.cookies.get(name);
      if (c) {
        to.cookies.set({
          name,
          value: c.value,
          path: c?.path ?? "/",
          httpOnly: c?.httpOnly ?? true,
          sameSite: c?.sameSite ?? "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
    } catch (e) {}
  }
}

export async function GET(request: NextRequest) {
  const responseInternal = NextResponse.next();
  try {
    const cart = await getOrCreateCartForRequest(request, responseInternal);
    const out = NextResponse.json({ success: true, cart }, { status: 200 });
    await copyCookies(responseInternal as any, out as any);
    return out;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
//  Merge carts from guest to user
  if (action === "merge") {
    const responseInternal = NextResponse.next();
    try {
      const mergedCart = await mergeGuestCartIntoUser(request, responseInternal);
      const out = NextResponse.json({ success: true, cart: mergedCart }, { status: 200 });
      await copyCookies(responseInternal as any, out as any);
      return out;
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 400 });
    }
  }
  // Adding product to cart
  const responseInternal = NextResponse.next();
  try {
    const body = await request.json().catch(() => ({}));
    const productId = body?.productId;
    const quantity = Number(body?.quantity ?? 1);

    if (!productId) {
      return NextResponse.json({ success: false, error: "productId is required" }, { status: 400 });
    }

    const result = await addToCartService(request, responseInternal, productId, quantity);
    const out = NextResponse.json({ success: true, cart: result.cart }, { status: 200 });
    await copyCookies(responseInternal as any, out as any);
    return out;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}
