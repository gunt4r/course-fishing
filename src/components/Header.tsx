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

import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCurrentUser } from '@/app/queries/users/userQuery';
import Container from './container/Container';
import HeaderDropdown from './HeaderDropdown';
import Loader from './Loader';
import { LocaleSwitcher } from './LocaleSwitcher';
import Logo from './Logo';

export default function Header(props: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, isLoading, error } = useCurrentUser();
  const t = useTranslations('Header');
  if (isLoading || !error) {
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
            className="cursor-pointer rounded-full text-cyan-50 backdrop-blur-sm duration-300 hover:bg-zinc-200 hover:px-4  hover:py-2.5 hover:text-blue-950 hover:transition-colors"
            onPress={() => setIsMenuOpen(true)}
          >
            <Icon icon="radix-icons:hamburger-menu" />
          </Button>
        </div>

        <NavbarMenu className="top-0 flex h-screen max-h-screen  w-full flex-col items-center gap-3 bg-default-200/50 pt-6 pb-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
          <Button
            className="bg-opacity-40 absolute top-7 right-7 flex h-10 w-10 rounded-full bg-gray-600 bg-clip-padding p-0 backdrop-blur-md backdrop-filter duration-300 hover:bg-gray-200 hover:text-gray-500 hover:transition-colors md:hidden"
            onPress={() => setIsMenuOpen(false)}
          >
            <Icon icon="iconamoon:close-bold" />
          </Button>
          <NavbarMenuItem>
            <Link
              className="text-cyan-950 transition-opacity hover:opacity-80"
              href="/"
              size="sm"
            >
              {t('home_link')}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="text-cyan-950 transition-opacity hover:opacity-80"
              href="/stories"
              size="sm"
            >
              {t('stories_link')}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="text-cyan-950 transition-opacity hover:opacity-80"
              href="/reviews"
              size="sm"
            >
              {t('reviews_link')}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="text-cyan-950 transition-opacity hover:opacity-80"
              href="/products"
              size="sm"
            >
              {t('products_link')}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem className="mb-4">
            <Button
              className="flex cursor-pointer border border-zinc-800 px-4 py-2.5 font-medium text-cyan-950 transition-opacity duration-300 hover:bg-zinc-900 hover:text-cyan-50 hover:opacity-80 hover:transition-colors"
              color="secondary"
              endContent={<Icon icon="solar:alt-arrow-right-linear" />}
              radius="full"
              variant="flat"
              as={Link}
              href="/sign-up"
            >
              {t('sign_in_link')}
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem>
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
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </Container>
  );
}
