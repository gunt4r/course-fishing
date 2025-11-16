'use client';
import type { User } from '@/models/user';
import { Field, Input, Label } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCheckoutStore } from '@/stores/checkout';

type BodyCheckoutProps = {
  user?: Partial<User>;
};

export default function BodyCheckout({ user }: BodyCheckoutProps) {
  const { setPhone, setPassword, setEmail } = useCheckoutStore();
  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setPassword(user.password || '');
    }
  }, [user, setPhone, setEmail, setPassword]);
  const t = useTranslations('Checkout');
  return (
    <div className="flex w-full flex-col">
      <main className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Field className="flex flex-col gap-4">
            <Label className="font-medium">{t('email_address')}</Label>
            <Input
              name="email"
              type="email"
              defaultValue={user?.email || ''}
              className="focus: w-full max-w-xl   rounded-full border border-cyan-50 bg-zinc-900/20 py-4 indent-5 transition-background duration-300 focus:bg-cyan-50 focus:text-zinc-900"
              onChange={e => setEmail(e.target.value)}
            />
          </Field>
          {!user
            ? (
                <Field className="flex flex-col gap-4">
                  <Label className="font-medium">{t('password')}</Label>
                  <Input
                    name="password"
                    type="password"
                    defaultValue=""
                    className="focus: w-full max-w-xl   rounded-full border border-cyan-50 bg-zinc-900/20 py-4 indent-5 transition-background duration-300 focus:bg-cyan-50 focus:text-zinc-900"
                    onChange={e => setPassword(e.target.value)}
                  />
                </Field>
              )
            : (
                <></>
              )}
          <Field className="flex flex-col gap-4">
            <Label className="font-medium">{t('phone')}</Label>
            <Input
              name="phone"
              type="phone"
              defaultValue={user?.phone || ''}
              className="focus: w-full max-w-xl   rounded-full border border-cyan-50 bg-zinc-900/20 py-4 indent-5 transition-background duration-300 focus:bg-cyan-50 focus:text-zinc-900"
              onChange={e => setPhone(e.target.value)}
            />
          </Field>
        </div>
      </main>
    </div>
  );
}
