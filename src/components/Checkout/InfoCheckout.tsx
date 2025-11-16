"use client";
import { useTranslations } from "next-intl";
import { useCheckoutStore } from "@/stores/checkout";
import { useCreateOrder } from "@/app/queries/orders/ordersQuery";
import { Button } from "@headlessui/react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
import { useCreatePaypalOrder } from "@/app/queries/paypal/paypalQuery";
import { useState } from "react";
import { useLocale } from "next-intl";
interface InfoCheckoutProps {
  totalPrice: number;
  items: any[];
}
export default function InfoCheckout({ totalPrice, items }: InfoCheckoutProps) {
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const { mutateAsync: createPaypalOrder, isPending: isPendingPaypal } =
    useCreatePaypalOrder();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { phone, password, email } = useCheckoutStore();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Cart");
  if (isPending || isPendingPaypal) return <Loader />;
  const handleSubmit = async () => {
    setIsButtonDisabled(true);
    try {
      const order = await createOrder(
        { phone, email, password },
        {
          onError: () => {
            console.log("Error creating order");
          },
        },
      );
      if (!order.success) {
        throw new Error(order.error || "Failed to create order");
      }
      const paypalOrder = await createPaypalOrder(
        { orderId: order.order.id, locale: locale },
        {
          onSuccess: () => {
            toast.success("Order created successfully");
          },
          onError: () => {
            console.log("Error creating order");
          },
        },
      );
      if (!paypalOrder.success) {
        throw new Error(paypalOrder.error || "Failed to create order");
      }
      window.location.href = paypalOrder.approvalUrl;
      router.push(paypalOrder.data.links[1].href);
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };
  return (
    <div
      style={{ boxShadow: "0 8px 32px rgba(31,38,135,0.15)" }}
      className="flex md:max-w-2/5 sm:max-w-4/5 transition-all duration-300 ease-in-out w-full text-left justify-self-end flex-col justify-between items-center mb-8 p-6 rounded-2xl backdrop-blur-md shadow-lg border border-white/20"
    >
      {items.map((item: any, index: number) => (
        <p
          key={index}
          className="flex w-full text-lg mb-6 text-left pb-4 border-b border-gray-200 justify-between"
        >
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
        disabled={isButtonDisabled}
      >
        {t("checkout")}
      </Button>
    </div>
  );
}
