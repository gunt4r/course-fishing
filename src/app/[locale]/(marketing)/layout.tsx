import { getTranslations, setRequestLocale } from 'next-intl/server';

import Link from 'next/link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import Header from '@/components/Header';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  return (
    <>
  <Header />
    </>
  );
}
