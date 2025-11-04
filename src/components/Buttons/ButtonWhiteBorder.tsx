import MyLink from "../Link";
import { Icon } from "@iconify/react";
export default function LinkWhiteBorder({
  href,
  children,
  classNames,
  showIcon = true,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  classNames?: string;
  [key: string]: any;
}) {
  return (
    <MyLink
      href={href}
      {...props}
      additionalClassNames={`border gap-2 rounded-full text-cyan-50 border-white py-2 px-4 hover:bg-white hover:text-black transition-all duration-300 ${classNames}`}
    >
      {showIcon && <Icon icon={"ep:arrow-right"} />}
      {children}
    </MyLink>
  );
}
