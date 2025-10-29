import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Container from "@/components/container/Container";
import Footer from "@/components/Footer";
export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <Container>
        <main>{props.children}</main>
      </Container>
      <Footer />
    </>
  );
}
