import ClientStories from '@/components/Stories/ClientStories';
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "Stories",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}
export default function Stories() {
  return <ClientStories />;
}
