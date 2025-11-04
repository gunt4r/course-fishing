"use client";
import Loader from "@/components/Loader";
import BodyCheckout from "@/components/Checkout/BodyCheckout";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/app/queries/users/userQuery";
import InfoCheckout from "@/components/Checkout/InfoCheckout";
export default function ClientCheckout({ cart }: { cart: any }) {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const t = useTranslations("Checkout");
  if (isLoadingUser) return <Loader />;
  return (
    <>
      <Title additionalClassNames="mb-10 uppercase" addMarginTop>
        {t("title")}
      </Title>
      <main className="flex items-center w-full lg:gap-30 gap-20 mb-40">
        <BodyCheckout user={currentUser} />
        <InfoCheckout totalPrice={cart.totalPrice} items={cart.items} />
      </main>
    </>
  );
}
