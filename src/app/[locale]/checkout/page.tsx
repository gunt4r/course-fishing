"use server";
import ClientCheckout from "@/components/Checkout/ClientCheckout";
import { redirect } from "next/navigation";
import { getOrCreateCartServer } from "@/services/cart/service";
import { cookies } from "next/headers";
export default async function Checkout() {
  const cookieStore = await cookies();
  const sessionId =
    cookieStore.get(process.env.NAME_SESSION_ID as string)?.value || "";
  const token = cookieStore.get("token")?.value || "";
  const userCart = await getOrCreateCartServer(sessionId, token);

  if (userCart && userCart.items.length === 0) {
    redirect("/cart");
  }
  const serializedCart = JSON.parse(JSON.stringify(userCart));
  return (
    <>
      <ClientCheckout cart={serializedCart} />
    </>
  );
}
