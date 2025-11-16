"use client";

import Modal from "../Modal";
import { useTranslations } from "next-intl";
import { Field, Label, Input, Switch, Description } from "@headlessui/react";
import { useState } from "react";
import HtmlEditor from "@/components/HtmlEditor";
import { ModalAddProductProps } from "@/types/modal";
import toast from "react-hot-toast";
export default function ModalAddProduct({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  refetch,
  isLoading,
}: ModalAddProductProps) {
  const t = useTranslations("Dashboard.Products");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    isActive: true,
    html: "",
    document: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("html", form.html);
      formData.append("isActive", String(form.isActive));

      if (file) {
        formData.append("image", file);
      } else if (form.image) {
        formData.append("imageUrl", form.image);
      }

      if (pdfFile) {
        formData.append("document", pdfFile);
      } else if (form.document) {
        formData.append("document", form.document);
      }
      handleSubmit(formData);
      if (refetch) {
        refetch();
      }
      setFile(null);
      setPdfFile(null);
      setIsModalOpen(false);
      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        isActive: true,
        html: "",
        document: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(t("errors.creation") || "Error creating product");
    } finally {
      setFile(null);
      setPdfFile(null);
      setIsModalOpen(false);
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
                {t("saving")}
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
        encType="mult"
        className="space-y-6 text-slate-900 dark:text-slate-100 px-1"
      >
        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {t("form.name")}
          </Label>
          <Input
            className="w-full border rounded-lg py-2.5 px-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {t("form.description")}
          </Label>
          <Input
            className="w-full border rounded-lg py-2.5 px-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field className="flex flex-col gap-2">
            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {t("form.price")}
            </Label>
            <Input
              type="number"
              step="0.01"
              className="w-full border rounded-lg py-2.5 px-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              required
            />
          </Field>

          <Field className="flex flex-col gap-2">
            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {t("form.image")}
            </Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="cursor-pointer w-full border rounded-lg py-2.5 px-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Field>
          <Field className="flex flex-col gap-2">
            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {t("form.document")}
            </Label>
            <Description className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t("form.documentDescription")}
            </Description>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                className="cursor-pointer w-full border rounded-lg py-2.5 px-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {form.document && (
                <a
                  href={form.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {t("form.viewCurrentDocument")}
                </a>
              )}
            </div>
          </Field>
        </div>

        <Field className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <Switch
            checked={form.isActive}
            onChange={(value) => setForm((p) => ({ ...p, isActive: value }))}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[checked]:bg-green-500"
          >
            <span className="sr-only">{t("form.active")}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
          </Switch>
          <div className="flex flex-col">
            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              {t("form.active")}
            </Label>
            <Description className="text-xs text-gray-500 dark:text-gray-400">
              {t("form.activeDescription")}
            </Description>
          </div>
        </Field>

        <Field className="flex flex-col gap-2 mb-2">
          <Label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {t("form.htmlContent")}
          </Label>
          <Description className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t("form.htmlDescription")}
          </Description>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-blue-500">
            <HtmlEditor
              value={form.html}
              onChange={(v) => setForm((p) => ({ ...p, html: v }))}
              placeholder={t("form.htmlPlaceholder")}
            />
          </div>
        </Field>
      </form>
    </Modal>
  );
}
