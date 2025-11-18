'use client';
import { Button, Field, Input, Label } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLoginUser } from '@/app/queries/users/userQuery';
import Loader from '../Loader';

export default function ClientSignIn() {
  const { mutateAsync: loginUser, isPending } = useLoginUser();
  const t = useTranslations('SignIn');
  const tCheckout = useTranslations('Checkout');
  const router = useRouter();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    await loginUser(JSON.stringify(data) as any, {
      onSuccess: () => {
        <Loader />;
        router.push('/');
        toast.success(t('sign_in_success'));
      },
      onError: () => {
        toast.error(t('sign_in_error'));
      },
    });
  }
  if (isPending) {
    return <Loader />;
  }
  return (
    <section
      style={{ boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}
      className="flex lg:max-w-2/5 sm:max-w-4/5 transition-all duration-300 ease-in-out my-24 w-full text-left justify-self-end flex-col justify-between items-center px-12 py-9 rounded-4xl backdrop-blur-md shadow-lg border border-white/20"
    >
      <h1 className="mb-6 text-2xl font-semibold uppercase">{t('sign_in')}</h1>
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
        <Button
          type="submit"
          className="mt-6 max-w-3/4 w-full flex self-center justify-center uppercase border gap-2 rounded-full text-cyan-50 border-white py-3 sm:px-4 px-6 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
        >
          {t('sign_in_button')}
        </Button>
      </form>
    </section>
  );
}
