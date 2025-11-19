'use client';

import type { NavbarProps } from '@heroui/react';

import {
  Button,
  cn,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/react';
import { Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useState, Fragment } from 'react';
import { useCurrentUser } from '@/app/queries/users/userQuery';
import Container from './container/Container';
import HeaderDropdown from './HeaderDropdown';
import Loader from './Loader';
import { LocaleSwitcher } from './LocaleSwitcher';
import Logo from './Logo';

export default function Header(props: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const t = useTranslations('Header');
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      <Navbar
        {...props}
        classNames={{
          base: cn('border-default-100', {
            'bg-default-200/50 dark:bg-default-100/50': isMenuOpen,
          }),
          wrapper: 'w-full justify-between max-w-7xl',
          item: 'hidden lg:flex',
        }}
        className="bg-transparent py-5 backdrop-filter-none"
        height="60px"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand>
          <div className="rounded-full text-background">
            <Logo />
          </div>
        </NavbarBrand>
        <NavbarContent justify="center" className="gap-8 ">
          <NavbarItem>
            <Link
              className="text-cyan-50 transition-opacity hover:opacity-80"
              href="/"
              size="sm"
            >
              {t('home_link')}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-cyan-50 transition-opacity hover:opacity-80"
              href="/stories"
              size="sm"
            >
              {t('stories_link')}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-cyan-50 transition-opacity hover:opacity-80"
              href="/reviews"
              size="sm"
            >
              {t('reviews_link')}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-cyan-50 transition-opacity hover:opacity-80"
              href="/products"
              size="sm"
            >
              {t('products_link')}
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem className="ml-2 flex! gap-2">
            <HeaderDropdown user={user} />
            <LocaleSwitcher />
          </NavbarItem>
        </NavbarContent>
        <div className="flex gap-2.5 md:hidden">
          <LocaleSwitcher className="" />
          <Button
            className="hover:opacity-80 transition-opacity bg-transparent rounded-full hover:py-2.5 hover:px-4 duration-300  text-cyan-50 backdrop-blur-sm cursor-pointer"
            onPress={() => setIsMenuOpen(true)}
          >
            <Icon icon="radix-icons:hamburger-menu" />
          </Button>
        </div>
        <Transition
          as={Fragment}
          show={isMenuOpen}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          >
        <NavbarMenu className="top-0 flex !h-screen max-h-screen  w-full flex-col items-center gap-7 bg-default-200/50 pt-6 pb-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50 z-100 text-cyan-50">
          <Button
            className="bg-opacity-40 absolute text-cyan-50 top-7 right-10 flex h-10 w-10 rounded-full bg-gray-600 bg-clip-padding p-0 backdrop-blur-md backdrop-filter duration-300 hover:bg-gray-200 hover:text-gray-500 hover:transition-colors md:hidden"
            onPress={() => setIsMenuOpen(false)}
          >
            <Icon icon="iconamoon:close-bold" />
          </Button>
          <NavbarMenuItem className='mt-16'>
            <Link
              className="transition-opacity text-2xl text-cyan-50 hover:opacity-80"
              href="/"
              size="sm"
            >
              {t('home_link')}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="transition-opacity text-2xl text-cyan-50 hover:opacity-80"
              href="/stories"
              size="sm"
            >
              {t('stories_link')}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="transition-opacity text-2xl text-cyan-50 hover:opacity-80"
              href="/reviews"
              size="sm"
            >
              {t('reviews_link')}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="transition-opacity text-2xl text-cyan-50 hover:opacity-80"
              href="/products"
              size="sm"
            >
              {t('products_link')}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem className="mb-4">
            <HeaderDropdown user={user} isMobile={true} />
          </NavbarMenuItem>
        </NavbarMenu>
        </Transition>
      </Navbar>
    </Container>
  );
}
