import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Benefits from '@/components/Home/Benefits';
import Creator from '@/components/Home/Creator';
import FAQ from '@/components/Home/FAQ';
import Hero from '@/components/Home/Hero';
import Statistics from '@/components/Home/Statistics';
import Steps from '@/components/Home/Steps';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Benefits />
      <Steps />
      <Creator />
      <Statistics />
      <FAQ />
    </>
  );
}
