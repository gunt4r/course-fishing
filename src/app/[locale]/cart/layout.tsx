import { setRequestLocale } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import Container from '@/components/container/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return (
    <>
      <Toaster position="bottom-right" />
      <Header />
      <Container>
        <main>{props.children}</main>
      </Container>
      <Footer />
    </>
  );
}
