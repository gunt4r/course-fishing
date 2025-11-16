import type { Order } from '@/models/order';
import type { Product } from '@/models/product';
import type { ModalAddOrderProps } from '@/types/modal';
import type { User } from '@/types/user';
import {
  Field,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { orderStatus } from '@/config/enum';
import Modal from '../Modal';

export default function ModalAddOrder({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  isLoading,
  users,
  products,
  refetch,
}: ModalAddOrderProps) {
  const t = useTranslations('Dashboard');
  const tProducts = useTranslations('Products');
  const [formData, setFormData] = useState<Partial<Order>>({
    user: undefined,
    products: [],
    totalAmount: 0,
    status: '',
  });
  const [userSearch, setUserSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

  const filteredUsers = useMemo(() => {
    if (!users) {
      return [];
    }
    if (!userSearch) {
      return users;
    }
    return users.filter((user: User) =>
      user.email.toLowerCase().includes(userSearch.toLowerCase()),
    );
  }, [users, userSearch]);

  const handleUserSelect = (user: any) => {
    setFormData(prev => ({ ...prev, user }));
    setUserSearch(user.email);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      products: selectedProducts,
      userId: formData.user?.id,
      totalAmount: totalPrice,
      status: formData.status,
    };
    handleSubmit(submitData as Order);
    if (refetch) {
      refetch();
    }
    setFormData({
      user: undefined,
      products: [],
      totalAmount: 0,
      status: '',
    });
  };

  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        user: undefined,
        products: [],
        totalAmount: 0,
        status: '',
      });
    }
  }, [isModalOpen]);
  const totalPrice = useMemo(() => {
    return selectedProducts.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );
  }, [selectedProducts]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setFormData({
          user: undefined,
          products: [],
          totalAmount: 0,
          status: '',
        });
        setIsModalOpen(false);
      }}
      title={<span>{t('add') ?? 'Add Order'}</span>}
      size="xl"
      footer={(
        <footer className="flex w-full flex-row justify-between">
          <button
            onClick={() => {
              setFormData({
                user: undefined,
                products: [],
                totalAmount: 0,
                status: '',
              });
              setIsModalOpen(false);
            }}
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
            User
            {' '}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            name="userSearch"
            type="text"
            required
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setIsUserDropdownOpen(Boolean(e.target.value));
              if (!e.target.value) {
                setFormData(prev => ({ ...prev, user: undefined }));
              }
            }}
            onFocus={() => {
              if (userSearch && filteredUsers.length > 0) {
                setIsUserDropdownOpen(true);
              }
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 transition-all focus:ring-2 focus:outline-none        dark:border-slate-600 dark:bg-slate-800"
            placeholder="Search user by email..."
          />

          <Transition
            as={Fragment}
            show={isUserDropdownOpen && filteredUsers.length > 0}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 -translate-y-1"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 -translate-y-1"
          >
            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800">
              {!formData.user
                && filteredUsers.map((user: User) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="cursor-pointer px-4 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-slate-700"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleUserSelect(user);
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {user.phone}
                    </p>
                  </div>
                ))}
            </div>
          </Transition>
          {formData.user && (
            <div className="flex  items-center justify-between rounded-lg border border-cyan-200 bg-green-50 p-3 dark:border-cyan-800 dark:bg-cyan-900/20">
              <p className="text-sm font-medium">
                {t('selected')}
                :
                {formData.user.email}
              </p>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, user: undefined }));
                  setUserSearch('');
                  setIsUserDropdownOpen(false);
                }}
                className="cursor-pointer transition-opacity duration-300 hover:opacity-30"
              >
                <Icon
                  icon="mingcute:close-fill"
                  className="text-red-700 dark:text-slate-100"
                />
              </button>
            </div>
          )}
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            {tProducts('title') ?? 'Products'}
            {' '}
            <span className="text-red-500">*</span>
          </Label>
          <Listbox
            value={selectedProducts}
            onChange={setSelectedProducts}
            multiple
          >
            {({ open }) => (
              <div>
                <ListboxButton className="relative min-h-[42px] w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-left transition-all focus:ring-2 focus:ring-zinc-800 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-zinc-600">
                  <span className="block truncate">
                    {selectedProducts.length > 0
                      ? `${selectedProducts.length} product(s) selected`
                      : 'Select products...'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Icon
                      icon="mdi:chevron-down"
                      className={`h-5 w-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
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
                  <ListboxOptions
                    anchor="bottom start"
                    className="z-[100] mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-black/10 [--anchor-gap:4px] focus:outline-none dark:bg-slate-800 dark:ring-white/10"
                  >
                    {products && products.length > 0
                      ? (
                          products.map((product: Product) => (
                            <ListboxOption
                              key={product.id}
                              value={product}
                              className="relative cursor-pointer px-4 py-2 text-slate-900 transition-all duration-300 select-none hover:bg-zinc-100 data-[focus]:opacity-70 dark:text-slate-100 data-[focus]:dark:bg-cyan-900/30 data-[focus]:dark:text-cyan-100"
                            >
                              {({ selected }) => (
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span
                                      className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}
                                    >
                                      {product.name}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                      $
                                      {Number(product.price).toFixed(2)}
                                    </span>
                                  </div>
                                  {selected && (
                                    <Icon
                                      icon="mdi:check"
                                      className="h-5 w-5 text-cyan-600 dark:text-cyan-400"
                                    />
                                  )}
                                </div>
                              )}
                            </ListboxOption>
                          ))
                        )
                      : (
                          <div className="px-4 py-2 text-sm text-slate-500">
                            No products available
                          </div>
                        )}
                  </ListboxOptions>
                </Transition>
              </div>
            )}
          </Listbox>
        </Field>

        {selectedProducts.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="mb-2 text-sm font-medium">Selected Products:</p>
            <ul className="space-y-1">
              {selectedProducts.map(product => (
                <li
                  key={product.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{product.name}</span>
                  <span className="font-medium">
                    $
                    {Number(product.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
              <p className="flex justify-between text-sm font-semibold">
                <span>Calculated Total:</span>
                <span>
                  $
                  {totalPrice.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        )}

        <Field className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            Status
            {' '}
            <span className="text-red-500">*</span>
          </Label>
          <Listbox
            onChange={val =>
              setFormData(prev => ({ ...prev, status: val }))}
          >
            {({ open }) => (
              <div>
                <ListboxButton className="relative min-h-[42px] w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-left transition-all focus:ring-2 focus:ring-zinc-800 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-zinc-600">
                  <span className="block truncate">
                    {formData.status ? formData.status : 'Select status...'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Icon
                      icon="mdi:chevron-down"
                      className={`h-5 w-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
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
                  <ListboxOptions
                    anchor="bottom start"
                    className="z-[100] mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-black/10 [--anchor-gap:4px] focus:outline-none dark:bg-slate-800 dark:ring-white/10"
                  >
                    {Object.values(orderStatus).map((status: string) => (
                      <ListboxOption
                        key={status}
                        value={status}
                        className="relative cursor-pointer px-4 py-2 text-slate-900 transition-all duration-300 select-none hover:bg-zinc-100 data-[focus]:opacity-70 dark:text-slate-100 data-[focus]:dark:bg-cyan-900/30 data-[focus]:dark:text-cyan-100"
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <span
                                className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}
                              >
                                {status}
                              </span>
                            </div>
                            {selected && (
                              <Icon
                                icon="mdi:check"
                                className="h-5 w-5 text-cyan-600 dark:text-cyan-400"
                              />
                            )}
                          </div>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </div>
            )}
          </Listbox>
        </Field>
      </form>
    </Modal>
  );
}
