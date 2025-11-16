import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import LinkWhiteBorder from '../Buttons/ButtonWhiteBorder';
import Title from '../Title';

export default function Creator() {
  const t = useTranslations('Index');
  return (
    <section className="mb-32">
      <p className="mt-4 mb-4 text-center text-2xl text-cyan-50">
        {t('creator_title')}
      </p>
      <Title additionalClassNames="mb-16">AlexFisherWay</Title>
      <div className="flex flex-col items-center gap-20 lg:flex-row">
        <img
          className="max-h-[600px] max-w-2/4 rounded-4xl"
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80"
          alt="Creator"
        />
        <aside className="relative h-full">
          <Icon
            icon="sidekickicons:quotation-mark-16-solid"
            className="absolute -top-[6px] -left-[40px] size-8 text-cyan-50"
          />
          <div className="mb-8 text-xl leading-10 text-cyan-50">
            {t.rich('creator_description', {
              ul: chunks => <ul className="ml-6 list-disc">{chunks}</ul>,
              li: chunks => <li>{chunks}</li>,
            })}
          </div>
          <LinkWhiteBorder
            classNames="flex justify-self-center text-xl"
            href="https://www.linkedin.com/in/alexey-fisherway"
          >
            {t('creator_read_more')}
          </LinkWhiteBorder>
        </aside>
      </div>
    </section>
  );
}
