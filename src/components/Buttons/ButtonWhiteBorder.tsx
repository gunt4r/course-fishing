import { Icon } from '@iconify/react';
import MyLink from '../Link';

export default function LinkWhiteBorder({
  href,
  children,
  classNames,
  wrapperClassNames,
  showIcon = true,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  classNames?: string;
  wrapperClassNames?: string;
  showIcon?: boolean;
  [key: string]: any;
}) {
  return (
    <MyLink
      href={href}
      {...props}
      wrapperClassNames={`border gap-2 rounded-full text-cyan-50 border-white py-2 px-4 hover:bg-white hover:text-black transition-all duration-300 ${wrapperClassNames}`}
      additionalClassNames={` ${classNames}`}
    >
      {showIcon && <Icon icon="ep:arrow-right" />}
      {children}
    </MyLink>
  );
}
