'use client';

import type { ModalEditProductProps } from '@/types/modal';
import { Description, Field, Input, Label, Switch } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/app/api/axios';
import HtmlEditor from '@/components/HtmlEditor';
import Modal from '../Modal';

export default function ModalEditProduct({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  product,
  isLoading,
  refetch,
}: ModalEditProductProps) {
  const t = useTranslations('Dashboard');
  const tHeader = useTranslations('Header');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    isActive: true,
    html: '',
    document: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  useEffect(() => {
    if (product && isModalOpen) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        image: product.image || '',
        isActive: product.isActive ?? true,
        html: product.html || '',
        document: product.document || '',
      });
      setFile(null);
    }
  }, [product, isModalOpen]);

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await api.post('/api/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.url;
  }
  async function uploadPDF(file: File) {
    setIsUploadingPdf(true);
    try {
      const fd = new FormData();
      fd.append('document', file);
      fd.append('name', 'document');
      const res = await api.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!res.data?.url) {
        throw new Error('PDF upload failed: missing URL in response');
      }

      return res.data.url;
    } finally {
      setIsUploadingPdf(false);
    }
  }
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = form.image;
      let documentUrl = form.document;
      if (file) {
        console.log(file);
        imageUrl = await uploadImage(file);
      }

      if (pdfFile) {
        documentUrl = await uploadPDF(pdfFile);
      }
      console.log(imageUrl);
      const payload = {
        id: product?.id,
        name: form.name,
        description: form.description,
        price: String(form.price),
        image: imageUrl,
        isActive: form.isActive,
        html: form.html,
        document: documentUrl,
      };

      handleSubmit(payload);
      if (refetch) {
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(t('Products.errors.update') || 'Error updating product');
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFile(null);
  };
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      title={(
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('edit')}
        </span>
      )}
      size="xl"
      footer={(
        <div className="flex w-full justify-between">
          <button
            onClick={handleClose}
            className="cursor-pointer rounded-xl border border-red-300 bg-red-50 px-6 py-2.5 font-medium text-red-700 transition-all duration-200 hover:border-red-400 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
            type="button"
          >
            {t('cancel')}
          </button>

          <button
            onClick={onSubmit}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            type="submit"
          >
            {isLoading
              ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('Products.saving')}
                  </>
                )
              : (
                  tHeader('save')
                )}
          </button>
        </div>
      )}
    >
      <form
        onSubmit={onSubmit}
        className="space-y-6 px-1 text-slate-900 dark:text-slate-100"
      >
        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Products.form.name')}
          </Label>
          <Input
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            required
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Products.form.description')}
          </Label>
          <Input
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500"
            value={form.description}
            onChange={e =>
              setForm(p => ({ ...p, description: e.target.value }))}
          />
        </Field>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Products.form.price')}
            </Label>
            <Input
              type="number"
              step="0.01"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500"
              value={form.price}
              onChange={e =>
                setForm(p => ({ ...p, price: e.target.value }))}
              required
            />
          </Field>

          <Field className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Products.form.image')}
            </Label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 transition-all duration-200 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:file:bg-blue-900/20 dark:file:text-blue-300"
            />
            {form.image && !file && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Current image:
                {' '}
                {form.image.split('/').pop()}
              </div>
            )}
          </Field>
          <Field className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Products.form.document')}
            </Label>
            <Description className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              {t('Products.form.documentDescription')}
            </Description>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 transition-all duration-200 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:file:bg-blue-900/20 dark:file:text-blue-300"
              />

              {form.document && (
                <a
                  href={form.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
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
                  {t('Products.form.viewCurrentDocument')}
                </a>
              )}
              {form.document && !pdfFile && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Current document:
                  {' '}
                  {form.document}
                </div>
              )}
              {isUploadingPdf && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  {t('Products.form.uploadingPdf')}
                </div>
              )}

            </div>
          </Field>
        </div>

        <Field className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Switch
            checked={form.isActive}
            onChange={value => setForm(p => ({ ...p, isActive: value }))}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none data-[checked]:bg-green-500 dark:bg-gray-700"
          >
            <span className="sr-only">{t('Products.form.active')}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
          </Switch>
          <div className="flex flex-col">
            <Label className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Products.form.active')}
            </Label>
            <Description className="text-xs text-gray-500 dark:text-gray-400">
              {t('Products.form.activeDescription')}
            </Description>
          </div>
        </Field>

        <Field className="mb-2 flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Products.form.htmlContent')}
          </Label>
          <Description className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            {t('Products.form.htmlDescription')}
          </Description>
          <div className="rounded-lg border border-gray-300 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
            <HtmlEditor
              value={form.html}
              onChange={v => setForm(p => ({ ...p, html: v }))}
              placeholder={t('Products.form.htmlPlaceholder')}
            />
          </div>
        </Field>
      </form>
    </Modal>
  );
}
