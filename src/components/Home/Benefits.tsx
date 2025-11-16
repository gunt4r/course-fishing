"use client";
import { useTranslations } from "next-intl";
import Title from "../Title";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import { Image } from "@heroui/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "./styleBenefits.scss";
import MyLink from "../Link";
import { Icon } from "@iconify/react";
import { useGetArticlesByType } from "@/app/queries/articles/articlesQuery";
import Loader from "../Loader";
import { ArticleEnum } from "@/config/enum";
export default function Benefits() {
  const { data: articles, isLoading } = useGetArticlesByType(
    ArticleEnum.testimonial,
  );
  const t = useTranslations("Index");
  const benefits = [
    {
      id: 1,
      title: t("benefits_money_title"),
      description: t("benefits_money_description"),
      icon: "solar:hand-money-linear",
    },
    {
      id: 2,
      title: t("benefits_housing_title"),
      description: t("benefits_housing_description"),
      icon: "solar:armchair-2-bold",
    },
    {
      id: 3,
      title: t("benefits_experience_title"),
      description: t("benefits_experience_description"),
      icon: "arcticons:studysmarter",
    },
  ];
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="mb-20">
      <Title additionalClassNames="mb-16">{t("benefits_title")}</Title>
      <center className="flex items-center lg:flex-row flex-col ">
        <aside className="w-2/4">
          <Swiper
            modules={[A11y, Pagination]}
            slidesPerView={1}
            className="max-w-4xl md:w-3/4 w-full md:h-[400px] h-[350px] max-h-[600px] mt-16 lg:mb-6 mb-20"
            effect="cards"
            pagination={{ clickable: true }}
          >
            {articles.map((slide: any) => (
              <SwiperSlide key={slide.id}>
                <MyLink href={`/reviews/${slide.id}`}>
                  <div className="flexflex-col items-center relative ">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      className="w-full md:h-[400px] h-[300px] max-w-3xl rounded-4xl
                    flex mx-auto"
                    />
                    <div className="absolute -bottom-[5px] bg-cyan-950 w-full max-h-52 h-1/5 flex items-center justify-center rounded-b-4xl z-10">
                      <p className="text-2xl text-cyan-50 font-bold">
                        {slide.title}
                      </p>
                    </div>
                  </div>
                </MyLink>
              </SwiperSlide>
            ))}
          </Swiper>
        </aside>
        <div className="max-w-2xl">
          <div className="flex flex-col gap-10 items-start">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="flex items-center gap-8 mb-4">
                <Icon
                  icon={benefit.icon}
                  className="min-w-16 h-16 w-16 text-cyan-50"
                />
                <div className="flex flex-col gap-3.5">
                  <h3 className="font-bold text-left text-cyan-50 text-3xl">
                    {benefit.title}
                  </h3>
                  <p className="text-cyan-50 text-left">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </center>
    </section>
  );
}
