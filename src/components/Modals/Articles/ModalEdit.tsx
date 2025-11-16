'use client';

import type { ModalEditArticleProps } from '@/types/modal';
import {
  Description,
  Field,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Switch,
  Transition,
} from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/app/api/axios';
import HtmlEditor from '@/components/HtmlEditor';
import Modal from '../Modal';

export default function ModalEditArticle({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  article,
  isLoading,
  refetch,
}: ModalEditArticleProps) {
  const t = useTranslations('Dashboard');
  const tHeader = useTranslations('Header');
  const [form, setForm] = useState({
    title: '',
    image: '',
    isActive: true,
    html: '',
    type: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const TYPES = [
    { value: 'review', label: t('Articles.form.review') },
    { value: 'testimonial', label: t('Articles.form.testimonial') },
  ];
  useEffect(() => {
    if (article && isModalOpen) {
      setForm({
        title: article.title || '',
        image: article.image || '',
        isActive: article.isActive ?? true,
        html: article.html || '',
        type: article.type || '',
      });
      setFile(null);
    }
  }, [article, isModalOpen]);

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await api.post('/api/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.url;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = form.image;

      if (file) {
        console.log(file);
        imageUrl = await uploadImage(file);
      }

      const payload = {
        id: article?.id,
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
    } catch (err) {
      console.error(err);
      toast.error(t('Articles.errors.update') || 'Error updating article');
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
                    {t('Articles.saving')}
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
            {t('Articles.form.name')}
          </Label>
          <Input
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            required
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Articles.form.image')}
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

        <Field className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Switch
            checked={form.isActive}
            onChange={value => setForm(p => ({ ...p, isActive: value }))}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none data-[checked]:bg-green-500 dark:bg-gray-700"
          >
            <span className="sr-only">{t('Articles.form.active')}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
          </Switch>
          <div className="flex flex-col">
            <Label className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('Articles.form.active')}
            </Label>
            <Description className="text-xs text-gray-500 dark:text-gray-400">
              {t('Articles.form.activeDescription')}
            </Description>
          </div>
        </Field>
        <Field>
          <Label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Articles.form.type')}
          </Label>

          <Listbox
            value={form.type}
            onChange={val => setForm(p => ({ ...p, type: val }))}
          >
            <div className="relative">
              <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-left shadow-sm transition-colors duration-150 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
                <span className="block truncate text-sm text-gray-900 dark:text-gray-100">
                  {TYPES.find(tpe => tpe.value === form.type)?.label
                    || t('Articles.form.choose_type')}
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
                <ListboxOptions className="ring-opacity-5 absolute z-50 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg ring-1 ring-black focus:outline-none dark:border-gray-700 dark:bg-gray-800">
                  {TYPES.map(option => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
                      as={Fragment}
                    >
                      {({ active, selected }) => (
                        <li
                          className={`relative flex cursor-pointer items-center py-2 pr-4 pl-4 select-none ${
                            active
                              ? 'bg-gray-100 dark:bg-gray-700'
                              : 'bg-transparent'
                          } ${selected ? 'font-semibold' : 'font-normal'}`}
                        >
                          <span
                            className={`block truncate ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            {option.label}
                          </span>
                          {selected
                            ? (
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
                              )
                            : null}
                        </li>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </Field>
        <Field className="mb-2 flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Articles.form.htmlContent')}
          </Label>
          <Description className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            {t('Articles.form.htmlDescription')}
          </Description>
          <div className="rounded-lg border border-gray-300 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
            <HtmlEditor
              value={form.html}
              onChange={v => setForm(p => ({ ...p, html: v }))}
              placeholder={t('Articles.form.htmlPlaceholder')}
            />
          </div>
        </Field>
      </form>
    </Modal>
  );
}
