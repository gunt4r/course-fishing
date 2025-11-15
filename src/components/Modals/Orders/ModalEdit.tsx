import Modal from "../Modal";
import { useTranslations } from "next-intl";
import {
  Field,
  Label,
  Input,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { Icon } from "@iconify/react";
import type { Order } from "@/models/order";
import type { User } from "@/types/user";
import type { Product } from "@/models/product";
import { useState, useEffect, useMemo, Fragment } from "react";
import { ModalEditOrderProps } from "@/types/modal";
import { orderStatus } from "@/config/enum";
export default function ModalEditOrder({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  isLoading,
  order,
  users,
  products,
  refetch,
}: ModalEditOrderProps) {
  const t = useTranslations("Dashboard");
  const tProducts = useTranslations("Products");

  const [formData, setFormData] = useState<Partial<Order>>({
    id: "",
    user: undefined,
    products: [],
    totalAmount: 0,
    status: "",
  });

  const [userSearch, setUserSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        id: order.id || "",
        user: order.user,
        products: order.products || [],
        totalAmount: order.totalAmount || 0,
        status: order.status || "",
      });
      setUserSearch(order.user?.email || "");
      setSelectedProducts(order.products || []);
      setIsUserDropdownOpen(false);
    }
  }, [order]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!userSearch) return users;
    return users.filter((user: User) =>
      user.email.toLowerCase().includes(userSearch.toLowerCase()),
    );
  }, [users, userSearch]);

  useEffect(() => {
    setIsUserDropdownOpen(Boolean(userSearch && filteredUsers.length > 0));
  }, [userSearch, filteredUsers.length]);

  const handleUserSelect = (user: any) => {
    setFormData((prev) => ({ ...prev, user }));
    setUserSearch(user.email);
    setIsUserDropdownOpen(false);
  };

  const handleTotalAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, totalAmount: numValue }));
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
  };

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
          status: "",
        });
        setIsModalOpen(false);
      }}
      title={<span>{t("edit") ?? "Edit Order"}</span>}
      size="xl"
      footer={
        <footer className="flex flex-row justify-between w-full">
          <button
            onClick={() => {
              setFormData({
                user: undefined,
                products: [],
                totalAmount: 0,
                status: "",
              });
              setIsModalOpen(false);
            }}
            className="px-4 py-2 rounded-2xl border bg-red-700 text-cyan-100 border-slate-300 dark:border-slate-600 hover:bg-red-900 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            disabled={isLoading}
            type="button"
          >
            {t("cancel") ?? "Cancel"}
          </button>

          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-2xl bg-green-700 text-white cursor-pointer disabled:opacity-50 hover:opacity-70 duration-300 transition-opacity"
            disabled={isLoading}
            type="submit"
          >
            {isLoading
              ? (t("updating") ?? "Updating...")
              : (t("update") ?? "Update")}
          </button>
        </footer>
      }
    >
      <form
        onSubmit={onSubmit}
        className="space-y-4 text-slate-900 dark:text-slate-100 px-2 mb-2.5"
      >
        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm">
            {t("order_id") ?? "Order ID"}
          </Label>
          <Input
            name="orderId"
            type="text"
            disabled
            value={formData.id}
            className="border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg w-full focus:outline-none cursor-not-allowed"
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm">
            {"User"} <span className="text-red-500">*</span>
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
                setFormData((prev) => ({ ...prev, user: undefined }));
              }
            }}
            onFocus={() => {
              if (userSearch && filteredUsers.length > 0)
                setIsUserDropdownOpen(true);
            }}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg w-full focus:outline-none        focus:ring-2 transition-all"
            placeholder="Search user by email..."
          />

          <Transition
            as={Fragment}
            show={isUserDropdownOpen && filteredUsers.length > 0}
            enter="transition ease-out duration-450"
            enterFrom="transform opacity-0 -translate-y-1"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition ease-in duration-300"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 -translate-y-1"
          >
            <div className="max-h-48 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 mt-1">
              {isUserDropdownOpen &&
                !formData.user &&
                filteredUsers.map((user: User) => (
                  <div
                    key={user.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleUserSelect(user);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-slate-700 transition-colors"
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
            <div className="p-3  flex items-center justify-between bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 mt-2">
              <p className="text-sm font-medium">
                Selected: {formData.user.email}
              </p>
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, user: undefined }));
                  setUserSearch("");
                  setIsUserDropdownOpen(false);
                }}
                className="cursor-pointer hover:opacity-30 duration-300 transition-opacity"
                type="button"
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
          <Label className="font-medium text-sm">
            {tProducts("title") ?? "Products"}{" "}
            <span className="text-red-500">*</span>
          </Label>

          <Listbox
            value={selectedProducts}
            onChange={setSelectedProducts}
            multiple
          >
            {({ open }) => (
              <div>
                <ListboxButton className="relative w-full cursor-pointer border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-600 transition-all min-h-[42px]">
                  <span className="block truncate">
                    {selectedProducts.length > 0
                      ? `${selectedProducts.length} product(s) selected`
                      : "Select products..."}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Icon
                      icon="mdi:chevron-down"
                      className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </span>
                </ListboxButton>

                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-150"
                  enterFrom="transform opacity-0 -translate-y-1"
                  enterTo="transform opacity-100 translate-y-0"
                  leave="transition ease-in duration-100"
                  leaveFrom="transform opacity-100 translate-y-0"
                  leaveTo="transform opacity-0 -translate-y-1"
                >
                  <ListboxOptions className="z-[100] mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 shadow-xl ring-1 ring-black/10 dark:ring-white/10 focus:outline-none [--anchor-gap:4px]">
                    {products && products.length > 0 ? (
                      products.map((product: Product) => (
                        <ListboxOption
                          key={product.id}
                          value={product}
                          className="relative cursor-pointer select-none duration-300 transition-all py-2 px-4 data-[focus]:opacity-70 data-[focus]:dark:bg-cyan-900/30 hover:bg-zinc-100 data-[focus]:dark:text-cyan-100 text-slate-900 dark:text-slate-100"
                        >
                          {({ selected }) => (
                            <div className="flex items-center justify-between">
                              <div>
                                <span
                                  className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}
                                >
                                  {product.name}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  ${Number(product.price).toFixed(2)}
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
                    ) : (
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
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium mb-2">Selected Products:</p>
            <ul className="space-y-1">
              {selectedProducts.map((product) => (
                <li
                  key={product.id}
                  className="text-sm flex justify-between items-center"
                >
                  <span>{product.name}</span>
                  <span className="font-medium">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold flex justify-between">
                <span>Calculated Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
        )}

        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm">
            {t("total_amount") ?? "Total Amount"}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            name="totalAmount"
            type="number"
            step="0.01"
            required
            value={totalPrice || String(formData.totalAmount)}
            onChange={(e) => handleTotalAmountChange(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 transition-all"
            placeholder="0.00"
          />
        </Field>
        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm">
            {"Status"} <span className="text-red-500">*</span>
          </Label>
          <Listbox
            value={formData.status}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, status: val }))
            }
          >
            {({ open }) => (
              <div>
                <ListboxButton className="relative w-full cursor-pointer border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-600 transition-all min-h-[42px]">
                  <span className="block truncate">
                    {formData.status ? formData.status : "Select status..."}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Icon
                      icon="mdi:chevron-down"
                      className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
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
                    className="z-[100] mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 shadow-xl ring-1 ring-black/10 dark:ring-white/10 focus:outline-none [--anchor-gap:4px]"
                  >
                    {Object.values(orderStatus).map((status: string) => (
                      <ListboxOption
                        key={status}
                        value={status}
                        className="relative cursor-pointer select-none duration-300 transition-all py-2 px-4 data-[focus]:opacity-70 data-[focus]:dark:bg-cyan-900/30 hover:bg-zinc-100 data-[focus]:dark:text-cyan-100 text-slate-900 dark:text-slate-100"
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <span
                                className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}
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
