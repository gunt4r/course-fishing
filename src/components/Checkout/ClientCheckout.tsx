'use client';
import { useTranslations } from 'next-intl';
import { useCurrentUser } from '@/app/queries/users/userQuery';
import BodyCheckout from '@/components/Checkout/BodyCheckout';
import InfoCheckout from '@/components/Checkout/InfoCheckout';
import Loader from '@/components/Loader';
import Title from '@/components/Title';

export default function ClientCheckout({ cart }: { cart: any }) {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const t = useTranslations('Checkout');
  if (isLoadingUser) {
    return <Loader />;
  }
  return (
    <>
      <Title additionalClassNames="mb-10 uppercase" addMarginTop>
        {t('title')}
      </Title>
      <main className="flex items-center w-full lg:gap-30 gap-20 mb-40 md:flex-row flex-col">
        <BodyCheckout user={currentUser} />
        <InfoCheckout totalPrice={cart.totalPrice} items={cart.items} />
      </main>
    </>
  );
}
