"use client";
import Container from "./container/Container";
import Logo from "./Logo";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import MyLink from "./Link";
export default function Footer() {
  const navigationTranslation = useTranslations("Header");
  const t = useTranslations("Footer");
  return (
    <Container>
      <footer className="flex flex-col text-cyan-50 text-[16px] gap-16 mt-10 mx-auto pb-14">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16 ">
          {" "}
          <div>
            <Logo classNames="mb-6" size={60} />{" "}
            <p className="text-center">{t("description")}</p>
          </div>
          <div>
            <p className="text-2xl text-center mb-4">{t("contacts")}</p>{" "}
            <div className="flex justify-center items-center gap-3.5">
              <Icon icon="material-symbols:mail" />{" "}
              <a href="mailto:office@alexfisherway.com">
                office@alexfisherway.com
              </a>
            </div>
          </div>
          <div>
            <p className="text-2xl mb-4">{t("navigation")}</p>{" "}
            <ul className="flex flex-col gap-3">
              <li>
                <MyLink addHoverOpacity href="/">
                  {navigationTranslation("home_link")}
                </MyLink>
              </li>
              <li>
                <MyLink addHoverOpacity href="/products">
                  {navigationTranslation("products_link")}
                </MyLink>
              </li>

              <li>
                <MyLink addHoverOpacity href="/reviews">
                  {navigationTranslation("reviews_link")}
                </MyLink>
              </li>

              <li>
                <MyLink addHoverOpacity href="/stories">
                  {navigationTranslation("stories_link")}
                </MyLink>
              </li>
              <li>
                <MyLink addHoverOpacity href="/cart">
                  {navigationTranslation("cart_link")}
                </MyLink>
              </li>
            </ul>
          </div>
        </section>
        <section className="flex justify-center items-center gap-2 flex-col">
          <p className="text-center max-w-4xl">{t("small_description")}</p>
          <MyLink addHoverOpacity href="/policy">
            {t("policy")}
          </MyLink>
          <p>
            {t("copyright")} {new Date().getFullYear()}.{" "}
            <a href="mailto:vladprangati@gmail.com">Made by Vlad Prangati</a>
          </p>
        </section>
      </footer>
    </Container>
  );
}
