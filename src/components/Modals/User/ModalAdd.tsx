import type { ModalAddUserProps } from '@/types/modal';
import type { User } from '@/types/user';
import {
  Field,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Role } from '@/config/enum';
import Modal from '../Modal';

export default function ModalAddUser({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  isLoading,
}: ModalAddUserProps) {
  const t = useTranslations('Dashboard');
  const tUser = useTranslations('Checkout');
  const [formData, setFormData] = useState<User>({
    email: '',
    password: '',
    phone: '',
    role: Role.USER,
  });

  const handleChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={<span>{t('add') ?? 'Add User'}</span>}
      size="lg"
      footer={(
        <footer className="flex w-full flex-row justify-between">
          <button
            onClick={() => setIsModalOpen(false)}
            className="cursor-pointer rounded-2xl border border-slate-300 bg-red-700 px-4 py-2 text-cyan-100 transition-colors hover:bg-red-900 dark:border-slate-600 dark:hover:bg-slate-800"
            disabled={isLoading}
            type="button"
          >
            {t('cancel') ?? 'Cancel'}
          </button>

          <button
            onClick={onSubmit}
            className="cursor-pointer rounded-2xl bg-green-700 px-4 py-2 text-white transition-opacity duration-300 hover:opacity-70 disabled:opacity-50"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (t('adding') ?? 'Adding...') : (t('add') ?? 'Add')}
          </button>
        </footer>
      )}
    >
      <form
        onSubmit={onSubmit}
        className="mb-2.5 space-y-4 px-2 text-slate-900 dark:text-slate-100"
      >
        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            {tUser('email_address') ?? 'Email'}
            {' '}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 transition-all focus:ring-2 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
            placeholder="user@example.com"
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            {tUser('password') ?? 'Password'}
            {' '}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            name="password"
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={e => handleChange('password', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 transition-all focus:ring-2 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
            placeholder="••••••••"
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            {tUser('phone') ?? 'Phone'}
            {' '}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 transition-all focus:ring-2 focus:outline-none dark:border-slate-600  dark:bg-slate-800"
            placeholder="+1234567890"
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            {t('role') ?? 'Role'}
            {' '}
            <span className="text-red-500">*</span>
          </Label>
          <Listbox
            value={formData.role}
            onChange={value => handleChange('role', value)}
          >
            {({ open }) => (
              <>
                <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-left transition-all focus:ring-2 focus:ring-zinc-800 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-zinc-600">
                  <span className="block truncate capitalize">
                    {formData.role}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Icon
                      icon="mdi:chevron-down"
                      className={`h-5 w-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </span>
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom start"
                  className="z-[100] mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-black/10 [--anchor-gap:4px] focus:outline-none dark:bg-slate-800 dark:ring-white/10"
                >
                  {Object.values(Role).map(role => (
                    <ListboxOption
                      key={role}
                      value={role}
                      className="relative cursor-pointer px-4 py-2 text-slate-900 transition-all duration-300 select-none hover:bg-zinc-100 data-[focus]:opacity-70 dark:text-slate-100 data-[focus]:dark:bg-cyan-900/30 data-[focus]:dark:text-cyan-100"
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate capitalize ${selected ? 'font-semibold' : 'font-normal'}`}
                          >
                            {role}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-cyan-600 dark:text-cyan-400">
                              <Icon icon="mdi:check" className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </>
            )}
          </Listbox>
        </Field>
      </form>
    </Modal>
  );
}
