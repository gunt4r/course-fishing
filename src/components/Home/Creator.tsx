import Title from "../Title";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import LinkWhiteBorder from "../Buttons/ButtonWhiteBorder";
export default function Creator() {
  const t = useTranslations("Index");
  return (
    <section className="mb-32">
      <p className="text-2xl text-cyan-50 text-center mt-4 mb-4">
        {t("creator_title")}
      </p>
      <Title additionalClassNames="mb-16">AlexFisherWay</Title>
      <div className="flex items-center gap-20">
        <img
          className="max-h-[600px] max-w-2/4 rounded-4xl"
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80"
          alt="Creator"
        />
        <aside className="relative h-full">
          <Icon
            icon="sidekickicons:quotation-mark-16-solid"
            className="absolute size-8 -top-[6px] -left-[40px] text-cyan-50"
          />
          <div className="text-cyan-50 text-xl leading-10 mb-8">
            {t.rich("creator_description", {
              ul: (chunks) => <ul className="list-disc ml-6">{chunks}</ul>,
              li: (chunks) => <li>{chunks}</li>,
            })}
          </div>
          <LinkWhiteBorder
            classNames="flex justify-self-center text-xl"
            href="https://www.linkedin.com/in/alexey-fisherway"
          >
            {t("creator_read_more")}
          </LinkWhiteBorder>
        </aside>
      </div>
    </section>
  );
}
