import { setRequestLocale } from "next-intl/server";
import { routing } from "@/libs/I18nRouting";

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  let signInUrl = "/sign-in";
  let signUpUrl = "/sign-up";
  let dashboardUrl = "/admin";
  let afterSignOutUrl = "/";

  if (locale !== routing.defaultLocale) {
    signInUrl = `/${locale}${signInUrl}`;
    signUpUrl = `/${locale}${signUpUrl}`;
    dashboardUrl = `/${locale}${dashboardUrl}`;
    afterSignOutUrl = `/${locale}${afterSignOutUrl}`;
  }

  return <main>{props.children}</main>;
}
