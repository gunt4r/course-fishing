"use client";
import { Input, Field, Label } from "@headlessui/react";
import type { User } from "@/models/user";
import { useTranslations } from "next-intl";
import { useCheckoutStore } from "@/stores/checkout";
interface BodyCheckoutProps {
  user?: Partial<User>;
}

export default function BodyCheckout({ user }: BodyCheckoutProps) {
  const { email, password, phone, setPhone, setPassword, setEmail } = useCheckoutStore();
  const t = useTranslations("Checkout");
  return (
    <div className="w-full flex flex-col">
      {Boolean(user) ? (
        <></>
      ) : (
        <main className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <Field className="flex flex-col gap-4">
              <Label className="font-medium">{t("email_address")}</Label>
              <Input
                name="email"
                type="email"
                value={email}
                defaultValue={user?.email || ""}
                className="border bg-zinc-900/20 max-w-xl   border-cyan-50 py-4 indent-5 rounded-full w-full focus: focus:bg-cyan-50 focus:text-zinc-900 duration-300 transition-background"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field className="flex flex-col gap-4">
              <Label className="font-medium">{t("password")}</Label>
              <Input
                name="password"
                type="password"
                value={password}
                defaultValue={user?.password || ""}
                className="border bg-zinc-900/20 max-w-xl   border-cyan-50 py-4 indent-5 rounded-full w-full focus: focus:bg-cyan-50 focus:text-zinc-900 duration-300 transition-background"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Field className="flex flex-col gap-4">
              <Label className="font-medium">{t("phone")}</Label>
              <Input
                name="phone"
                type="phone"
                value={phone}
                defaultValue={user?.phone || ""}
                className="border bg-zinc-900/20 max-w-xl   border-cyan-50 py-4 indent-5 rounded-full w-full focus: focus:bg-cyan-50 focus:text-zinc-900 duration-300 transition-background"
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
          </div>
        </main>
      )}
    </div>
  );
}
