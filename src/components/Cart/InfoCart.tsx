'use client';
import { useTranslations } from 'next-intl';
import LinkWhiteBorder from '../Buttons/ButtonWhiteBorder';

export default function InfoCart({ totalPrice }: { totalPrice: number }) {
  const t = useTranslations('Cart');
  return (
    <div
      style={{ boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}
      className="mb-8 flex w-full max-w-1/4 flex-col items-center justify-between justify-self-end rounded-2xl border border-white/20 p-6 text-left shadow-lg backdrop-blur-md"
    >
      <p className="mb-6 flex w-full justify-between text-left text-small">
        Subtotal:
        {' '}
        <span>
          {totalPrice.toFixed(2)}
          {' '}
          €
        </span>
      </p>
      <p className="mb-8 flex w-full justify-between text-xl font-medium">
        Total:
        {' '}
        <span>
          {totalPrice.toFixed(2)}
          {' '}
          €
        </span>
      </p>
      <LinkWhiteBorder
        href="/checkout"
        wrapperClassNames="mt-6 py-4 w-full justify-center uppercase"
        showIcon={false}
      >
        {t('checkout')}
      </LinkWhiteBorder>
    </div>
  );
}
