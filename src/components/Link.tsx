'use client';
import { Link } from '@heroui/react';

export default function MyLink({
  href,
  children,
  additionalClassNames,
  wrapperClassNames,
  addHoverOpacity,
}: {
  href: string;
  children?: React.ReactNode;
  additionalClassNames?: string;
  wrapperClassNames?: string;
  addHoverOpacity?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${addHoverOpacity ? 'transition-opacity duration-300 hover:opacity-80' : ''} text-cyan-50 ${wrapperClassNames} `}
    >
      <main className={`flex items-center ${additionalClassNames}`}>
        {children}
      </main>
    </Link>
  );
}
