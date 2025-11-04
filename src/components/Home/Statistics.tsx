"use client";
import Title from "../Title";
import { useTranslations } from "next-intl";
import AnimatedNumbers from "react-animated-numbers";
export default function Statistics() {
  const t = useTranslations("Index");
  const numbers = [
    {
      id: 1,
      title: 6000,
      description: t("statistics_boats_description"),
    },
    {
      id: 2,
      title: 30000,
      description: t("statistics_people_description"),
    },
    {
      id: 3,
      title: 9370,
      description: t("statistics_salary_description"),
    },
  ];
  return (
    <section>
      <Title additionalClassNames="text-5xl">{t("statistics_title")}</Title>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-10 max-w-6xl mx-auto">
        {numbers.map((step) => (
          <div key={step.id} className="flex flex-col items-center h-full">
            <AnimatedNumbers
              useThousandsSeparator
              animateToNumber={step.title}
              fontStyle={{
                fontSize: "3rem",
              }}
              className=" text-cyan-50 text-center font-bold mt-4"
            />
            <p className="text-lg text-cyan-50 text-center mt-2">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
