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
} from "@headlessui/react";
import { Icon } from "@iconify/react";
import { Role } from "@/config/enum";
import type { User } from "@/types/user";
import { useState, useEffect } from "react";
import { ModalEditUserProps } from "@/types/modal";

export default function ModalEditUser({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  isLoading,
  user,
}: ModalEditUserProps) {
  const t = useTranslations("Dashboard");
  const tUser = useTranslations("Checkout");
  const [formData, setFormData] = useState<User>({
    id: "",
    email: "",
    password: "",
    phone: "",
    role: Role.USER,
  });
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        role: user.role || Role.USER,
      });
      setChangePassword(false);
    }
  }, [user]);

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!changePassword) {
      delete submitData.password;
    }
    handleSubmit(submitData);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={<span>{t("edit") ?? "Edit User"}</span>}
      size="lg"
      footer={
        <footer className="flex flex-row justify-between w-full">
          <button
            onClick={() => setIsModalOpen(false)}
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
            {tUser("email_address") ?? "Email"}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 transition-all"
            placeholder="user@example.com"
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm">
            {tUser("phone") ?? "Phone"} <span className="text-red-500">*</span>
          </Label>
          <Input
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 transition-all"
            placeholder="+1234567890"
          />
        </Field>

        <Field className="flex flex-col gap-2">
          <Label className="font-medium text-sm">
            {t("role") ?? "Role"} <span className="text-red-500">*</span>
          </Label>
          <Listbox
            value={formData.role}
            onChange={(value) => handleChange("role", value)}
          >
            {({ open }) => (
              <>
                <ListboxButton className="relative w-full cursor-pointer border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-600 transition-all">
                  <span className="block truncate capitalize">
                    {formData.role}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Icon
                      icon="mdi:chevron-down"
                      className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </span>
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom start"
                  className="z-[100] mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 shadow-xl ring-1 ring-black/10 dark:ring-white/10 focus:outline-none [--anchor-gap:4px]"
                >
                  {Object.values(Role).map((role) => (
                    <ListboxOption
                      key={role}
                      value={role}
                      className="relative cursor-pointer select-none duration-300 transition-all py-2 px-4 data-[focus]:opacity-70 data-[focus]:dark:bg-cyan-900/30 hover:bg-zinc-100 data-[focus]:dark:text-cyan-100 text-slate-900 dark:text-slate-100"
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate capitalize ${selected ? "font-semibold" : "font-normal"}`}
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

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <Field className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="changePassword"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
              className="w-4 h-4 text-cyan-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-cyan-500 dark:focus:ring-cyan-400 cursor-pointer transition-all"
            />
            <Label
              htmlFor="changePassword"
              className="font-medium text-sm cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              {tUser("change_password") ?? "Change Password"}
            </Label>
          </Field>

          {changePassword && (
            <Field className="flex flex-col gap-2">
              <Label className="font-medium text-sm">
                {tUser("new_password") ?? "New Password"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                name="password"
                type="password"
                required={changePassword}
                minLength={6}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 transition-all"
                placeholder="••••••••"
              />
            </Field>
          )}
        </div>
      </form>
    </Modal>
  );
}
