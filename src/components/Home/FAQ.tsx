"use client";

import { Fragment, useState } from "react";
import Title from "../Title";
import {
  Disclosure,
  Transition,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useTranslations } from "next-intl";

export default function FAQ() {
  const t = useTranslations("Index");
  const items = [
    {
      id: 1,
      title: t("faq_first_title"),
      content: t("faq_first_description"),
    },
    {
      id: 2,
      title: t("faq_second_title"),
      content: t("faq_second_description"),
    },
    {
      id: 3,
      title: t("faq_third_title"),
      content: t("faq_third_description"),
    },
    {
      id: 4,
      title: t("faq_fourth_title"),
      content: t("faq_fourth_description"),
    },
    {
      id: 5,
      title: t("faq_fifth_title"),
      content: t("faq_fifth_description"),
    },
    {
      id: 6,
      title: t("faq_sixth_title"),
      content: t("faq_sixth_description"),
    },
    {
      id: 7,
      title: t("faq_seventh_title"),
      content: t("faq_seventh_description"),
    },
  ];
  const [openPanels, setOpenPanels] = useState<boolean[]>(
    items.map(() => false),
  );

  const togglePanel = (index: number) => {
    setOpenPanels((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 mb-20">
      <div className="mb-8 text-center">
        <Title>{t("faq_title")}</Title>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <Disclosure key={idx}>
            <div
              key={idx}
              className="bg-gradient-to-r from-white/6 to-white/3 backdrop-blur-sm border border-white/6 rounded-2xl shadow-lg overflow-hidden"
            >
              <DisclosureButton
                onClick={() => togglePanel(idx)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 md:py-5 text-left"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-100 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                </div>

                <span
                  className={`ml-4 shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-800/40 backdrop-blur-sm border border-white/6 transition-transform duration-500 ease-out ${
                    openPanels[idx] ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-slate-200"
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
                <DisclosurePanel className="px-6 pb-5 text-slate-300 leading-relaxed border-t border-white/6 bg-gradient-to-b from-transparent to-white/2 overflow-hidden">
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
