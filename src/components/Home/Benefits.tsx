"use client";
import { useTranslations } from "next-intl";
import Title from "../Title";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "./styleBenefits.scss";
import MyLink from "../Link";
import { Icon } from "@iconify/react";
export default function Benefits() {
  const t = useTranslations("Index");
  const slides = [
    {
      id: 1,
      title: "Explore the Mountains",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 2,
      title: "Urban Lifestyle",
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 3,
      title: "Ocean Breeze",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 4,
      title: "Desert Dreams",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 5,
      title: "Forest Escape",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80",
    },
  ];

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
  return (
    <section className="mb-20">
      <Title additionalClassNames="mb-16">{t("benefits_title")}</Title>
      <center className="flex items-center">
        <aside className="w-2/4">
          <Swiper
            modules={[A11y, Pagination]}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            className="max-w-4xl w-3/4 max-h-[600px] mt-16 mb-6 "
            effect="cards"
            pagination={{ clickable: true }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <MyLink href={`/products/${slide.id}`}>
                  <div className="flex flex-col items-center relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-[530px] max-w-3xl rounded-4xl
                    flex mx-auto"
                    />
                    <div className="absolute -bottom-[5px] bg-cyan-950 w-full max-h-52 h-1/5 flex items-center justify-center rounded-b-4xl">
                      <h2 className="text-2xl text-cyan-50 font-bold">
                        {slide.title}
                      </h2>
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
