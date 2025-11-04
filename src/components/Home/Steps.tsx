import Title from "../Title";
import { useTranslations } from "next-intl";
export default function Steps() {
  const t = useTranslations("Index");
  const steps = [
    {
      id: 1,
      title: t("steps_follow_title"),
      description: t("steps_follow_description"),
    },
    {
      id: 2,
      title: t("steps_documents_title"),
      description: t("steps_documents_description"),
    },
    {
      id: 3,
      title: t("steps_ready_title"),
      description: t("steps_ready_description"),
    },
  ];
  return (
    <section className="mb-32">
      <Title additionalClassNames="text-5xl">{t("steps_title")}</Title>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-10 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center max-w-xl max-h-[170px] h-full"
          >
            <h3 className="text-2xl text-cyan-50 text-center font-bold mt-4">
              {step.title}
            </h3>
            <p className="text-lg text-cyan-50 text-center mt-2">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
