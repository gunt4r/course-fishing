"use client";
import logo from "@/assets/img/logo.svg";
import { Link } from "@heroui/react";
export default function Logo({
  size = 45,
  classNames,
}: {
  size?: number;
  classNames?: string;
}) {
  return (
    <Link
      className={`flex cursor-pointer hover:opacity-80 transition-opacity duration-300 ${classNames}`}
      style={{ height: `${size}px` }}
      href="/"
    >
      <img src={logo.src} alt="logo" className="w-full h-full" />
    </Link>
  );
}
