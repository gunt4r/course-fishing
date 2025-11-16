'use client';
import { Image, Link } from '@heroui/react';
import logo from '@/assets/img/logo.svg';

export default function Logo({
  size = 45,
  classNames,
}: {
  size?: number;
  classNames?: string;
}) {
  return (
    <Link
      className={`flex cursor-pointer transition-opacity duration-300 hover:opacity-80 ${classNames}`}
      style={{ height: `${size}px` }}
      href="/"
    >
      <Image src={logo.src} alt="logo" className="h-full w-full" />
    </Link>
  );
}
