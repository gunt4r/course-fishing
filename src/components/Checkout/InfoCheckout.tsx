"use client";
import { useTranslations } from "next-intl";
import LinkWhiteBorder from "../Buttons/ButtonWhiteBorder";
import { useCheckoutStore } from "@/stores/checkout";
import { useCreateOrder } from "@/app/queries/orders/ordersQuery";
import { Button } from "@headlessui/react";
interface InfoCheckoutProps {
  totalPrice: number;
  items: any[];
}
export default function InfoCheckout({ totalPrice, items }: InfoCheckoutProps) {
  const { mutateAsync: createOrder} = useCreateOrder();
  const { phone, password, email } = useCheckoutStore();
  const t = useTranslations("Cart");

  const handleSubmit = async () => {
    try {
      await createOrder({ phone, email, password });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }
  return (
    <div
      style={{ boxShadow: "0 8px 32px rgba(31,38,135,0.15)" }}
      className="flex max-w-2/5 w-full text-left justify-self-end flex-col justify-between items-center mb-8 p-6 rounded-2xl backdrop-blur-md shadow-lg border border-white/20"
    >
      {items.map((item: any) => (
        <p className="flex w-full text-lg mb-6 text-left pb-4 border-b border-gray-200 justify-between">
          {item.product.name}
          <span>{item.product.price} €</span>
        </p>
      ))}
      <p className="flex w-full text-small mb-6 text-left justify-between">
        Subtotal: <span>{totalPrice.toFixed(2)} €</span>
      </p>
      <p className="flex w-full text-xl font-medium justify-between mb-8">
        Total: <span>{totalPrice.toFixed(2)} €</span>
      </p>
      <Button
        className="mt-6 w-full justify-center uppercase border gap-2 rounded-full text-cyan-50 border-white py-2 px-4 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
        onClick={handleSubmit}
      >
        {t("checkout")}
      </Button>
    </div>
  );
}
