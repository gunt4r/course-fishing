"use client";
import { useCart } from "@/app/queries/cart/cartQuery";
import Loader from "@/components/Loader";
import BodyCart from "@/components/Cart/BodyCart";
import InfoCart from "@/components/Cart/InfoCart";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import LinkWhiteBorder from "@/components/Buttons/ButtonWhiteBorder";
export default function Cart() {
  const { data: userCart, isLoading } = useCart();
  const t = useTranslations("Cart");
  if (isLoading) return <Loader />;
  return (
    <>
      <Title additionalClassNames="mb-10 uppercase" addMarginTop>
        {t("title")}
      </Title>
      {userCart && userCart.cart.items.length > 0 ? (
        <main className="flex items-center w-full lg:gap-40 gap-20 mb-40">
          <BodyCart cartItems={userCart.cart.items} />
          <InfoCart totalPrice={userCart.cart.totalPrice} />
        </main>
      ) : (
        <main className="flex flex-col items-center justify-center mb-40 mt-20">
          <p className="text-2xl mb-12">{t("empty_cart")}.</p>
          <LinkWhiteBorder href="/products">
            {t("continue_shopping")}
          </LinkWhiteBorder>
        </main>
      )}
    </>
  );
}
