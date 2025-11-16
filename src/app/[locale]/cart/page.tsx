'use client';
import { useTranslations } from 'next-intl';
import { useCart } from '@/app/queries/cart/cartQuery';
import LinkWhiteBorder from '@/components/Buttons/ButtonWhiteBorder';
import BodyCart from '@/components/Cart/BodyCart';
import InfoCart from '@/components/Cart/InfoCart';
import Loader from '@/components/Loader';
import Title from '@/components/Title';

export default function Cart() {
  const { data: userCart, isLoading } = useCart();
  const t = useTranslations('Cart');
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Title additionalClassNames="mb-10 uppercase" addMarginTop>
        {t('title')}
      </Title>
      {userCart && userCart.cart.items.length > 0
        ? (
            <main className="mb-40 flex w-full items-center gap-20 lg:gap-40">
              <BodyCart cartItems={userCart.cart.items} />
              <InfoCart totalPrice={userCart.cart.totalPrice} />
            </main>
          )
        : (
            <main className="mt-20 mb-40 flex flex-col items-center justify-center">
              <p className="mb-12 text-2xl">
                {t('empty_cart')}
                .
              </p>
              <LinkWhiteBorder href="/products">
                {t('continue_shopping')}
              </LinkWhiteBorder>
            </main>
          )}
    </>
  );
}
