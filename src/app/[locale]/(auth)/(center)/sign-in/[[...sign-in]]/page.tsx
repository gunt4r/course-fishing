import ClientSignIn from "@/components/SignIn/ClientSignIn";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
type ISignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: ISignUpPageProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "SignIn",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function SignIn(props: ISignUpPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <ClientSignIn />;
}
