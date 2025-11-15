"use client";
import { useTranslations } from "next-intl";
import LinkWhiteBorder from "../Buttons/ButtonWhiteBorder";
export default function Hero() {
  const t = useTranslations("Index");
  return (
    <section className="mb-20">
      <iframe
        width="100%"
        height="500"
        src="https://www.youtube.com/embed/15Apu0bCfW4"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="w-3/4 flex mx-auto mt-10 mb-12 max-w-6xl"
      />
      <LinkWhiteBorder
        wrapperClassNames="flex justify-self-center"
        href="/products"
      >
        {t("hero_link")}
      </LinkWhiteBorder>
    </section>
  );
}
