import { setRequestLocale } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import SideBar from '@/components/Admin/Dashboard/Sidebar';
import { HeroUIProvider } from '@heroui/react';
export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return (
    <>
      <Toaster position="bottom-right" />
      <HeroUIProvider>
        <main className="flex items-center">
        <SideBar />
        {props.children}
      </main>
      </HeroUIProvider>
    </>
  );
}
