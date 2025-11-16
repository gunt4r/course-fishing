import { setRequestLocale } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default async function CenteredLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <section>
      <Toaster position="bottom-right" />
      <Header />
      <div className="flex flex-col items-center justify-center">
        {props.children}
      </div>
      <Footer />
    </section>
  );
}
