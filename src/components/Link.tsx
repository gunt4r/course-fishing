"use client";
import { Link } from "@heroui/react";

export default function MyLink({
  href,
  children,
  additionalClassNames,
  addHoverOpacity,
}: {
  href: string;
  children: React.ReactNode;
  additionalClassNames?: string;
  addHoverOpacity?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${addHoverOpacity ? "hover:opacity-80 duration-300 transition-opacity" : ""} ${additionalClassNames} `}
    >
      {children}
    </Link>
  );
}
