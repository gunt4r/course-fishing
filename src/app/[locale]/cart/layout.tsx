import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Container from "@/components/container/Container";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return (
    <>
      <Toaster />
      <Header />
      <Container>
        <main>{props.children}</main>
      </Container>
      <Footer />
    </>
  );
}
