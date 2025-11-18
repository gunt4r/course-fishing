'use client';
import type { CardProductProps } from '@/types/product';
import { Image } from '@heroui/react';
import { useTranslations } from 'next-intl';
import LinkWhiteBorder from '../Buttons/ButtonWhiteBorder';
import MyLink from '../Link';

export default function CardProduct({
  id,
  name,
  price,
  image,
}: CardProductProps) {
  const t = useTranslations('Products');
  return (
    <MyLink
      addHoverOpacity
      additionalClassNames="flex flex-col min-w-[300px] max-w-[350px] gap-6 items-center justify-center w-full"
      href={`/products/${id}`}
    >
      <Image
        className="flex self-center opacity-100"
        src={image || 'https://picsum.photos/192/180'}
        alt={name}
      />
      <p className="text-left text-3xl">{name}</p>
      <p className="text-xl text-zinc-400">
        {price}
        {' '}
        €
      </p>
      <LinkWhiteBorder showIcon={false} href={`/products/${id}`}>
        {t('buy_now')}
      </LinkWhiteBorder>
    </MyLink>
  );
}
