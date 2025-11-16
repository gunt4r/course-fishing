'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';
import Title from '../Title';

export default function FAQ() {
  const t = useTranslations('Index');
  const items = [
    {
      id: 1,
      title: t('faq_first_title'),
      content: t('faq_first_description'),
    },
    {
      id: 2,
      title: t('faq_second_title'),
      content: t('faq_second_description'),
    },
    {
      id: 3,
      title: t('faq_third_title'),
      content: t('faq_third_description'),
    },
    {
      id: 4,
      title: t('faq_fourth_title'),
      content: t('faq_fourth_description'),
    },
    {
      id: 5,
      title: t('faq_fifth_title'),
      content: t('faq_fifth_description'),
    },
    {
      id: 6,
      title: t('faq_sixth_title'),
      content: t('faq_sixth_description'),
    },
    {
      id: 7,
      title: t('faq_seventh_title'),
      content: t('faq_seventh_description'),
    },
  ];
  const [openPanels, setOpenPanels] = useState<boolean[]>(
    items.map(() => false),
  );

  const togglePanel = (index: number) => {
    setOpenPanels(prev => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <section className="mx-auto mb-20 max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <Title>{t('faq_title')}</Title>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <Disclosure key={idx}>
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-white/6 bg-gradient-to-r from-white/6 to-white/3 shadow-lg backdrop-blur-sm"
            >
              <DisclosureButton
                onClick={() => togglePanel(idx)}
                className="cursour-pointer flex w-full items-center justify-between gap-4 px-6 py-4 text-left md:py-5"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-white md:text-xl">
                    {item.title}
                  </h3>
                </div>

                <span
                  className={`ml-4 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/6 bg-slate-800/40 backdrop-blur-sm transition-transform duration-500 ease-out ${
                    openPanels[idx] ? 'rotate-180' : ''
                  }`}
                  aria-hidden
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-[4px] h-5 w-5 text-slate-200"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M6 8l4 4 4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </DisclosureButton>

              <Transition
                as={Fragment}
                show={openPanels[idx]}
                enter="transition-all duration-500 ease-out"
                enterFrom="opacity-0 max-h-0 -translate-y-0"
                enterTo="opacity-100 max-h-[480px] translate-y-0"
                leave="transition-all duration-450 ease-in"
                leaveFrom="opacity-100 max-h-[480px] translate-y-0"
                leaveTo="opacity-0 max-h-0 -translate-y-2"
              >
                <DisclosurePanel className="overflow-hidden border-t border-white/6 bg-gradient-to-b from-transparent to-white/2 px-6 pb-5 leading-relaxed text-slate-300">
                  <div className="pt-3">
                    <p className="text-sm md:text-base">{item.content}</p>
                  </div>
                </DisclosurePanel>
              </Transition>
            </div>
          </Disclosure>
        ))}
      </div>
    </section>
  );
}
