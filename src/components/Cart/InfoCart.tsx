"use client";
import { useTranslations } from "next-intl";
import LinkWhiteBorder from "../Buttons/ButtonWhiteBorder";
export default function InfoCart({ totalPrice }: { totalPrice: number }) {
  const t = useTranslations("Cart");
  return (
    <div
      style={{ boxShadow: "0 8px 32px rgba(31,38,135,0.15)" }}
      className="flex lg:max-w-2/5 sm:max-w-4/5 transition-all duration-300 ease-in-out w-full text-left justify-self-end flex-col justify-between items-center mb-8 p-6 rounded-2xl backdrop-blur-md shadow-lg border border-white/20"
    >
      <p className="flex w-full text-small mb-6 text-left justify-between">
        Subtotal: <span>{totalPrice.toFixed(2)} €</span>
      </p>
      <p className="flex w-full text-xl font-medium justify-between mb-8">
        Total: <span>{totalPrice.toFixed(2)} €</span>
      </p>
      <LinkWhiteBorder
        href="/checkout"
        wrapperClassNames="mt-6 py-4 w-full justify-center uppercase"
        showIcon={false}
      >
        {t("checkout")}
      </LinkWhiteBorder>
    </div>
  );
}
