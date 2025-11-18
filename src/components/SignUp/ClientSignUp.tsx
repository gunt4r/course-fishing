'use client';
import { Button, Field, Input, Label } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useRegisterUser } from '@/app/queries/users/userQuery';

export default function ClientSignUp() {
  const { mutateAsync: registerUser } = useRegisterUser();
  const t = useTranslations('SignUp');
  const tCheckout = useTranslations('Checkout');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
    };
    await registerUser(JSON.stringify(data) as any, {
      onSuccess: () => {
        toast.success(t('sign_up_success'));
        router.push('/sign-in');
      },
      onError: () => {
        toast.error(t('sign_up_error'));
      },
    });
  }
  return (
    <section
      style={{ boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}
      className="flex lg:max-w-2/5 sm:max-w-4/5 transition-all duration-300 ease-in-out my-24 w-full text-left justify-self-end flex-col justify-between items-center px-12 py-9 rounded-4xl backdrop-blur-md shadow-lg border border-white/20"
    >
      <h1 className="mb-6 text-2xl font-semibold uppercase">{t('sign_up')}</h1>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col">
          <Field className="flex flex-col gap-3">
            {' '}
            <Label htmlFor="email" className="mb-2">
              {tCheckout('email_address')}
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              className="rounded-xl border border-gray-300 p-2"
              required
            />
          </Field>
        </div>
        <div className="flex flex-col">
          <Field className="flex flex-col gap-3">
            {' '}
            <Label htmlFor="password" className="mb-2">
              {tCheckout('password')}
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              className="rounded-xl border border-gray-300 p-2"
              required
            />
          </Field>
        </div>
        <div className="flex flex-col">
          <Field className="flex flex-col gap-3">
            {' '}
            <Label htmlFor="phone" className="mb-2">
              {tCheckout('phone')}
            </Label>
            <Input
              id="phone"
              type="phone"
              name="phone"
              className="rounded-xl border border-gray-300 p-2"
              required
            />
          </Field>
        </div>
        <Button
          type="submit"
          className="mt-6 flex w-full max-w-3/4 cursor-pointer justify-center gap-2 self-center rounded-full border border-white px-4 py-3 text-cyan-50 uppercase transition-all duration-300 hover:bg-white hover:text-black"
        >
          {t('sign_up_button')}
        </Button>
      </form>
    </section>
  );
}
