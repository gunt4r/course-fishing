'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLogoutUser, useUpdateUser } from '@/app/queries/users/userQuery';
import { REACT_QUERY_GET_ME_KEY } from '@/config/const';
import { Role } from '@/config/enum';
import LinkWhiteBorder from './Buttons/ButtonWhiteBorder';
import Loader from './Loader';
import Modal from './Modals/Modal';

export default function HeaderDropdown({
  user,
  isAdmin = false,
}: {
  user: any;
  isAdmin?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const t = useTranslations('Header');
  const tCheckout = useTranslations('Checkout');

  const { mutateAsync: logoutUser, isPending } = useLogoutUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    setPhone(user?.phone ?? '');
  }, [user?.phone]);

  const handleLogout = async () => {
    try {
      await logoutUser(undefined, {
        onSuccess: () => {
          toast.success(t('sign_out_success_toast'));
        },
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(t('sign_out_error_toast') ?? 'Logout failed');
    }
  };

  const openProfileModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const payload: any = { phone };
      if (newPassword) {
        payload.password = newPassword;
      }

      updateUser(payload, {
        onSuccess: () => {
          toast.success(t('profile_update_success') ?? 'Profile updated');
          setIsModalOpen(false);
        },

        onError: (error: any) => {
          toast.error(error.message);
        },
      });
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_ME_KEY] });
    } catch (err: any) {
      console.error('Profile update error:', err);
      toast.error(err.message);
    } finally {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={<span>{t('settings_link')}</span>}
        size="md"
        footer={(
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded border px-4 py-2"
              disabled={isUpdating}
            >
              {t('cancel') ?? 'Cancel'}
            </button>

            <button
              onClick={e => handleSubmit(e as any)}
              className="cursor-pointer rounded-2xl border border-zinc-900 px-4  py-2 text-zinc-800 transition-background duration-300 hover:bg-zinc-900 hover:text-cyan-50 disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating
                ? (t('saving') ?? 'Saving...')
                : (t('save') ?? 'Save')}
            </button>
          </>
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-zinc-900">
          <div>
            <label className="mb-1 block text-sm font-medium">
              {tCheckout('phone')}
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {tCheckout('new_password')}
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder={tCheckout('password_placeholder_leave')}
            />
            <p className="mt-1 text-xs text-slate-700">
              {tCheckout('password_condition')}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {tCheckout('confirm_password')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder={tCheckout('repeat_password')}
            />
          </div>
        </form>
      </Modal>

      {user
        ? (
            <Menu>
              <MenuButton
                className={`cursor-pointer self-center rounded-full text-left text-cyan-50 ${!isAdmin && 'px-4 py-2.5  duration-300 hover:bg-cyan-50 hover:text-blue-950 hover:transition-colors '} `}
              >
                {isAdmin ? 'Admin' : user.email}
              </MenuButton>

              <MenuItems
                anchor="bottom end"
                className=" z-100 rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-cyan-50 transition-colors-opacity duration-300 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
              >
                {user.role !== Role.USER && (
                  <MenuItem>
                    {({ active }) => (
                      <LinkWhiteBorder
                        href="/admin"
                        wrapperClassNames={`block px-4 py-2 bg-transparent text-left text-sm border-none w-full rounded-xl ${
                          active
                            ? 'bg-cyan-50 text-zinc-800 duration-300 transition-background '
                            : ''
                        }`}
                        showIcon={false}
                      >
                        {t('admin_link')}
                      </LinkWhiteBorder>
                    )}
                  </MenuItem>
                )}

                <MenuItem>
                  {({ active }) => (
                    <Button
                      onClick={openProfileModal}
                      className={`block w-full bg-transparent px-4 py-2 text-left text-sm text-cyan-50 ${
                        active
                          ? 'rounded-xl bg-cyan-50 text-zinc-800 transition-background duration-300'
                          : ''
                      }`}
                      variant={undefined}
                    >
                      {t('settings_link')}
                    </Button>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <Button
                      className={`block w-full bg-transparent px-4 py-2 text-left text-sm text-cyan-50 ${
                        active
                          ? 'rounded-xl bg-cyan-50 text-zinc-800 transition-background duration-300'
                          : ''
                      }`}
                      onClick={handleLogout}
                      variant={undefined}
                    >
                      {t('sign_out_link')}
                    </Button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          )
        : (
            <>
              <Button
                className="cursor-pointer self-center rounded-full px-4 py-2.5 text-cyan-50 duration-300 hover:bg-cyan-50 hover:transition-colors hover:text-zinc-800"
                as={Link}
                href="/sign-in"
                radius="full"
                variant="light"
              >
                {t('sign_in_link')}
              </Button>
              <Button
                className="flex cursor-pointer bg-foreground px-4 py-2.5 font-medium text-background transition-opacity hover:opacity-80"
                color="secondary"
                endContent={<Icon icon="solar:alt-arrow-right-linear" />}
                radius="full"
                variant="flat"
                size="lg"
                as={Link}
                href="/sign-up"
              >
                {t('sign_up_link')}
              </Button>
            </>
          )}
    </>
  );
}
