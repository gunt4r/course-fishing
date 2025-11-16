import { useTranslations } from 'next-intl';
import Title from '../Title';

export default function Steps() {
  const t = useTranslations('Index');
  const steps = [
    {
      id: 1,
      title: t('steps_follow_title'),
      description: t('steps_follow_description'),
    },
    {
      id: 2,
      title: t('steps_documents_title'),
      description: t('steps_documents_description'),
    },
    {
      id: 3,
      title: t('steps_ready_title'),
      description: t('steps_ready_description'),
    },
  ];
  return (
    <section className="mb-32">
      <Title additionalClassNames="text-5xl">{t('steps_title')}</Title>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-3">
        {steps.map(step => (
          <div
            key={step.id}
            className="flex h-full max-h-[170px] max-w-xl flex-col items-center"
          >
            <h3 className="mt-4 text-center text-2xl font-bold text-cyan-50">
              {step.title}
            </h3>
            <p className="mt-2 text-center text-lg text-cyan-50">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
