'use client';
import { Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { A11y, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useGetArticlesByType } from '@/app/queries/articles/articlesQuery';
import { ArticleEnum } from '@/config/enum';
import MyLink from '../Link';
import Loader from '../Loader';
import Title from '../Title';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import './styleBenefits.scss';

export default function Benefits() {
  const { data: articles, isLoading } = useGetArticlesByType(
    ArticleEnum.testimonial,
  );
  const t = useTranslations('Index');
  const benefits = [
    {
      id: 1,
      title: t('benefits_money_title'),
      description: t('benefits_money_description'),
      icon: 'solar:hand-money-linear',
    },
    {
      id: 2,
      title: t('benefits_housing_title'),
      description: t('benefits_housing_description'),
      icon: 'solar:armchair-2-bold',
    },
    {
      id: 3,
      title: t('benefits_experience_title'),
      description: t('benefits_experience_description'),
      icon: 'arcticons:studysmarter',
    },
  ];
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="mb-20">
      <Title additionalClassNames="mb-16">{t('benefits_title')}</Title>
      <center className="flex flex-col items-center lg:flex-row ">
        <aside className="w-2/4">
          <Swiper
            modules={[A11y, Pagination]}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={swiper => console.log(swiper)}
            className="mt-16 mb-20 h-[350px] max-h-[600px] w-full max-w-4xl md:h-[400px] md:w-3/4 lg:mb-6"
            effect="cards"
            pagination={{ clickable: true }}
          >
            {articles && articles.map((slide: any) => (
              <SwiperSlide key={slide.id}>
                <MyLink href={`/products/${slide.id}`}>
                  <div className="flex flex-col relative items-center ">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      className="mx-auto flex h-[300px] w-full max-w-3xl
                    rounded-4xl md:h-[400px] opacity-100"
                    />
                    <div className="absolute -bottom-[5px] flex h-1/5 max-h-52 w-full items-center justify-center rounded-b-4xl bg-cyan-950">
                      <p className="text-2xl font-bold text-cyan-50">
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
          <div className="flex flex-col items-start gap-10">
            {benefits.map(benefit => (
              <div key={benefit.id} className="mb-4 flex items-center gap-8">
                <Icon
                  icon={benefit.icon}
                  className="h-16 w-16 min-w-16 text-cyan-50"
                />
                <div className="flex flex-col gap-3.5">
                  <h3 className="text-left text-3xl font-bold text-cyan-50">
                    {benefit.title}
                  </h3>
                  <p className="text-left text-cyan-50">
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
