"use client";

import type { NavbarProps } from "@heroui/react";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import Logo from "./Logo";
import Container from "./container/Container";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useCurrentUser } from "@/app/queries/users/userQuery";
import Loader from "./Loader";
import HeaderDropdown from "./HeaderDropdown";
export default function Header(props: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const t = useTranslations("Header");
  if (isLoading) return <Loader />;

  return (
    <Container>
      <Navbar
        {...props}
        classNames={{
          base: cn("border-default-100", {
            "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
          }),
          wrapper: "w-full justify-between max-w-7xl",
          item: "hidden lg:flex",
        }}
        className="backdrop-filter-none py-5 bg-transparent"
        height="60px"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand>
          <div className="text-background rounded-full">
            <Logo />
          </div>
        </NavbarBrand>
        <NavbarContent justify="center" className="gap-8 ">
          <NavbarItem>
            <Link
              className="text-cyan-50 hover:opacity-80 transition-opacity"
              href="/"
              size="sm"
            >
              {t("home_link")}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-cyan-50 hover:opacity-80 transition-opacity"
              href="/stories"
              size="sm"
            >
              {t("stories_link")}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-cyan-50 hover:opacity-80 transition-opacity"
              href="/reviews"
              size="sm"
            >
              {t("reviews_link")}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-cyan-50 hover:opacity-80 transition-opacity"
              href="/products"
              size="sm"
            >
              {t("products_link")}
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
            className="hover:bg-zinc-200 rounded-full hover:py-2.5 hover:px-4 hover:text-blue-950 hover:transition-colors duration-300  text-cyan-50 backdrop-blur-sm cursor-pointer"
            onPress={() => setIsMenuOpen(true)}
          >
            <Icon icon="radix-icons:hamburger-menu" />
          </Button>
        </div>

        <NavbarMenu className="bg-default-200/50 shadow-medium dark:bg-default-100/50 top-0  pt-6 pb-6 backdrop-blur-md backdrop-saturate-150 flex w-full flex-col items-center max-h-screen h-screen gap-3">
          <Button
            className="flex p-0 md:hidden absolute top-7 right-7 w-10 h-10 bg-gray-600 rounded-full bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 hover:bg-gray-200 hover:text-gray-500 hover:transition-colors duration-300"
            onPress={() => setIsMenuOpen(false)}
          >
            <Icon icon="iconamoon:close-bold" />
          </Button>
          <NavbarMenuItem>
            <Link
              className="text-cyan-950 hover:opacity-80 transition-opacity"
              href="/"
              size="sm"
            >
              {t("home_link")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="text-cyan-950 hover:opacity-80 transition-opacity"
              href="/stories"
              size="sm"
            >
              {t("stories_link")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="text-cyan-950 hover:opacity-80 transition-opacity"
              href="/reviews"
              size="sm"
            >
              {t("reviews_link")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="text-cyan-950 hover:opacity-80 transition-opacity"
              href="/products"
              size="sm"
            >
              {t("products_link")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem className="mb-4">
            <Button
              className="border border-zinc-800 py-2.5 px-4 flex text-cyan-950 font-medium hover:opacity-80 transition-opacity cursor-pointer hover:bg-zinc-900 hover:text-cyan-50 hover:transition-colors duration-300"
              color="secondary"
              endContent={<Icon icon="solar:alt-arrow-right-linear" />}
              radius="full"
              variant="flat"
              as={Link}
              href="/sign-up"
            >
              {t("sign_in_link")}
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Button
              className="bg-foreground py-2.5 px-4 flex text-background font-medium hover:opacity-80 transition-opacity cursor-pointer"
              color="secondary"
              endContent={<Icon icon="solar:alt-arrow-right-linear" />}
              radius="full"
              variant="flat"
              size="lg"
              as={Link}
              href="/sign-up"
            >
              {t("sign_up_link")}
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </Container>
  );
}
