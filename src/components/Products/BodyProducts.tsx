'use client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useProducts } from '@/app/queries/product/productQuery';
import Grid from '../Grid';
import Loader from '../Loader';
import Title from '../Title';
import CardProduct from './CardProduct';

export default function BodyProducts() {
  const router = useRouter();
  const t = useTranslations('Products');
  const { data, isLoading, isError, error } = useProducts();
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    toast.error(error.message);
    setTimeout(() => {
      router.push('/');
    }, 1500);
  }
  return (
    <section className="mb-30 lg:mt-0 mt-10  w-full">
      <Title additionalClassNames="text-3xl uppercase mb-20">
        {t('title')}
      </Title>
      <Grid>
        {data
          && data.products.map((product: any) => (
            <CardProduct key={product.id} {...product} />
          ))}
      </Grid>
    </section>
  );
}
