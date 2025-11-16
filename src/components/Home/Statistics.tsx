'use client';
import { useTranslations } from 'next-intl';
import AnimatedNumbers from 'react-animated-numbers';
import Title from '../Title';

export default function Statistics() {
  const t = useTranslations('Index');
  const numbers = [
    {
      id: 1,
      title: 6000,
      description: t('statistics_boats_description'),
    },
    {
      id: 2,
      title: 30000,
      description: t('statistics_people_description'),
    },
    {
      id: 3,
      title: 9370,
      description: t('statistics_salary_description'),
    },
  ];
  return (
    <section>
      <Title additionalClassNames="text-5xl">{t('statistics_title')}</Title>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-3">
        {numbers.map(step => (
          <div key={step.id} className="flex h-full flex-col items-center">
            <AnimatedNumbers
              animateToNumber={step.title}
              useThousandsSeparator
              fontStyle={{
                fontSize: '3rem',
              }}
              className=" mt-4 text-center font-bold text-cyan-50"
            />
            <p className="mt-2 text-center text-lg text-cyan-50">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
