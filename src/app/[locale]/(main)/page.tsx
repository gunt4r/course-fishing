import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/Home/Hero";
import Benefits from "@/components/Home/Benefits";
import Steps from "@/components/Home/Steps";
import Creator from "@/components/Home/Creator";
import Statistics from "@/components/Home/Statistics";
import FAQ from "@/components/Home/FAQ";
type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "Index",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
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
