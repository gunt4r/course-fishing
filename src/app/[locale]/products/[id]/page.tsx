'use client';
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAddToCart } from '@/app/queries/cart/cartQuery';
import { useProduct } from '@/app/queries/product/productQuery';
import Loader from '@/components/Loader';

export default function ProductPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useProduct(id as string);
  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();
  const tHeader = useTranslations('Header');
  const tProducts = useTranslations('Products');
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  if (isLoading || isPending || isRedirecting) {
    return <Loader />;
  }

  if (isError) {
    toast.error(error.message);
    setTimeout(() => {
      router.push('/');
    }, 1500);
  }
  const handleSubmit = () => {
    addToCart(id as string, {
      onSuccess: () => {
        setIsRedirecting(true);
        toast.success(tProducts('product_has_been_added'));
        setTimeout(() => {
          router.push('/cart');
        }, 1500);
      },
      onError: () => {
        toast.error(tProducts('product_adding_error'));
      },
    });
  };
  return (
    <section className="mt-40">
      <main className="mb-40 flex flex-col items-center gap-16 lg:flex-row">
        <img
          src={data.product.image || 'https://picsum.photos/192/180'}
          className="w-2/4"
          alt={data.product.name}
        />
        <div>
          <Breadcrumbs variant="light" underline="hover" className="mb-20">
            <BreadcrumbItem
              className="cursor-pointer transition-opacity duration-300 hover:underline-offset-4 hover:opacity-75"
              classNames={{
                item: 'text-cyan-50',
                separator: 'text-cyan-50',
              }}
              href="/"
            >
              {tHeader('home_link')}
            </BreadcrumbItem>
            <BreadcrumbItem
              className="cursor-pointer transition-opacity duration-300 hover:underline-offset-4 hover:opacity-75"
              href="/products"
              classNames={{
                item: 'text-cyan-50',
                separator: 'text-cyan-50',
              }}
            >
              {tProducts('title')}
            </BreadcrumbItem>
            <BreadcrumbItem
              className="cursor-pointer transition-opacity duration-300 hover:underline-offset-4 hover:opacity-75"
              classNames={{
                item: 'text-cyan-50',
                separator: 'text-cyan-50',
              }}
            >
              {data.product.name}
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="mb-12 flex flex-col gap-2.5">
            <h1 className="mb-5 text-8xl">{data.product.name}</h1>
            <p className="text-2xl ">{data.product.description}</p>
            <p className="text-xl text-zinc-400">
              {data.product.price}
              {' '}
              €
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className="cursor-pointer rounded-full border border-cyan-50 px-6 py-4 text-xl duration-300 hover:bg-cyan-50 hover:text-zinc-900"
          >
            {tProducts('buy_now')}
          </button>
        </div>
      </main>
      <div
        dangerouslySetInnerHTML={{ __html: data.product.sanitizedHtml }}
        className="flex place-self-center"
      >
      </div>
    </section>
  );
}
