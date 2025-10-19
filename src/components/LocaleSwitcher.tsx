'use client';

import type { ChangeEventHandler } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';
import { Icon } from '@iconify/react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
export const LocaleSwitcher = ({ className } : { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.push(`/${event.target.value}${pathname}`);
    router.refresh();
  }; 
  return (
      <Menu  >
        <MenuButton className={`inline-flex cursor-pointer items-center gap-2 rounded-md duration-300 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/20 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:opacity-80 data-open:bg-gray-700 ${className}`}>
          {locale.toUpperCase()}
          <Icon icon="solar:alt-arrow-down-linear" className="size-4 fill-white/60"/>
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem>
            <button onClick={handleChange} value="ro" className="group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
              Română
            </button>
          </MenuItem>
          <MenuItem>
            <button onClick={handleChange} value="ru" className="group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
              Русский
            </button>
          </MenuItem>
          <MenuItem>
            <button onClick={handleChange} value="en" className="group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
              English
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
  );
};

// <select
//   defaultValue={locale}
//   onChange={handleChange}
//   className="cursor-pointer outline-none text-cyan-50 font-medium focus:opacity-80 hover:opacity-80 transition-opacity duration-300"
//   aria-label="lang-switcher"
// >
//   {routing.locales.map(elt => (
//     <option className='text-cyan-950 cursor-pointer' key={elt} value={elt}>
//       {elt.toUpperCase()}
//     </option>
//   ))}
// </select>