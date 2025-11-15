"use client";

import Modal from "../Modal";
import { useTranslations } from "next-intl";
import {
  Field,
  Label,
  Input,
  Switch,
  Description,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import HtmlEditor from "@/components/HtmlEditor";
import { api } from "@/app/api/axios";
import toast from "react-hot-toast";
import { ModalAddArticleProps } from "@/types/modal";
export default function ModalAddArticle({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  refetch,
  isLoading,
}: ModalAddArticleProps) {
  const t = useTranslations("Dashboard");
  const [form, setForm] = useState({
    title: "",
    image: "",
    isActive: true,
    html: "",
    type: "review",
  });
  const [file, setFile] = useState<File | null>(null);
  const TYPES = [
    { value: "review", label: t("Articles.form.review") },
    { value: "testimonial", label: t("Articles.form.testimonial") },
  ];
  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("image", file);
    const res = await api.post("/api/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.url;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = form.image;
      if (file) {
        imageUrl = await uploadImage(file);
      }
      const payload = {
        title: form.title,
        image: imageUrl,
        isActive: form.isActive,
        html: form.html,
        type: form.type,
      };
      handleSubmit(payload);
      if (refetch) {
        refetch();
      }
      setIsModalOpen(false);
      setForm({
        title: "",
        image: "",
        isActive: true,
        html: "",
        type: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error(t("Articles.errors.creation") || "Error creating article");
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("add")}
        </span>
      }
      size="xl"
      footer={
        <div className="flex justify-between w-full">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2.5 cursor-pointer rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
            type="button"
          >
            {t("cancel")}
          </button>

          <button
            onClick={onSubmit}
            className="px-6 py-2.5 cursor-pointer rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("Articles.saving")}
              </>
            ) : (
              t("add")
            )}
          </button>
        </div>
      }
    >
      <form
        onSubmit={onSubmit}
        className="space-y-6 text-slate-900 dark:text-slate-100 px-1"
      >
        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {t("Articles.form.name")}
          </Label>
          <Input
            className="w-full border rounded-lg py-2.5 px-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {t("Articles.form.image")}
          </Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="cursor-pointer w-full border rounded-lg py-2.5 px-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </Field>

        <Field className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <Switch
            checked={form.isActive}
            onChange={(value) => setForm((p) => ({ ...p, isActive: value }))}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[checked]:bg-green-500"
          >
            <span className="sr-only">{t("Articles.form.active")}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
          </Switch>
          <div className="flex flex-col">
            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              {t("Articles.form.active")}
            </Label>
            <Description className="text-xs text-gray-500 dark:text-gray-400">
              {t("Articles.form.activeDescription")}
            </Description>
          </div>
        </Field>

        <Field>
          <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
            {t("Articles.form.type")}
          </Label>

          <Listbox
            value={form.type}
            onChange={(val) => setForm((p) => ({ ...p, type: val }))}
          >
            <div className="relative">
              <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2.5 pl-3 pr-10 text-left shadow-sm hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="block truncate text-sm text-gray-900 dark:text-gray-100">
                  {TYPES.find((tpe) => tpe.value === form.type)?.label ||
                    t("Articles.form.choose_type")}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </ListboxButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="transform opacity-0 -translate-y-1"
                enterTo="transform opacity-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 translate-y-0"
                leaveTo="transform opacity-0 -translate-y-1"
              >
                <ListboxOptions className="absolute mt-2 max-h-56 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  {TYPES.map((option) => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
                      as={Fragment}
                    >
                      {({ active, selected }) => (
                        <li
                          className={`cursor-pointer select-none relative py-2 pl-4 pr-4 flex items-center ${
                            active
                              ? "bg-gray-100 dark:bg-gray-700"
                              : "bg-transparent"
                          } ${selected ? "font-semibold" : "font-normal"}`}
                        >
                          <span
                            className={`truncate block ${selected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {option.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-3 flex items-center text-blue-600 dark:text-blue-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          ) : null}
                        </li>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </Field>

        <Field className="flex flex-col gap-2 mb-2">
          <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {t("Articles.form.htmlContent")}
          </Label>
          <Description className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t("Articles.form.htmlDescription")}
          </Description>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-blue-500">
            <HtmlEditor
              value={form.html}
              onChange={(v) => setForm((p) => ({ ...p, html: v }))}
              placeholder={t("Articles.form.htmlPlaceholder")}
            />
          </div>
        </Field>
      </form>
    </Modal>
  );
}
