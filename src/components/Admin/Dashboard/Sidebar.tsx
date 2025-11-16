'use client';
import { Button } from '@headlessui/react';
import { Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Menu, menuClasses, MenuItem, Sidebar, sidebarClasses } from 'react-pro-sidebar';
import Logo from '../../Logo';

export default function SideBar() {
  const [isCollapsed, setCollapsed] = useState(true);
  const [isToggled, setToggled] = useState(true);

  const sizeIcons = 8;
  const handleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <Sidebar
      collapsed={isCollapsed}
      toggled={isToggled}
      onBackdropClick={() => setToggled(!isToggled)}
      className="h-screen"
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          background: 'transparent',
        },
      }}
    >
      <Menu
        rootStyles={{
          [`.${menuClasses.button}:hover`]: {
            background: 'transparent',
          },
        }}
      >
        <MenuItem className="cursor-pointer transition-opacity duration-300 hover:opacity-50 ">
          {isCollapsed
            ? (
                <Button onClick={handleCollapse} className="cursor-pointer">
                  <Icon
                    icon="material-symbols:menu-rounded"
                    className={`size-${sizeIcons}`}
                  />
                </Button>
              )
            : (
                <div className="flex w-full items-center justify-between justify-self-center">
                  <Logo size={sizeIcons + 20} />
                  <Button onClick={handleCollapse}>
                    <Icon
                      icon="hugeicons:arrow-left-03"
                      className={`size-${sizeIcons - 5}`}
                    />
                  </Button>
                </div>
              )}
        </MenuItem>

        <MenuItem
          className="cursor-pointer transition-opacity duration-300 hover:opacity-50 "
          component={<Link href="/admin" />}
          icon={(
            <Icon
              icon="material-symbols-light:dashboard-rounded"
              className={`size-${sizeIcons}`}
            />
          )}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          className="cursor-pointer transition-opacity duration-300 hover:opacity-50 "
          component={<Link href="/admin/users" />}
          icon={<Icon icon="mage:users-fill" className={`size-${sizeIcons}`} />}
        >
          Users
        </MenuItem>
        <MenuItem
          className="cursor-pointer transition-opacity duration-300 hover:opacity-50 "
          component={<Link href="/admin/orders" />}
          icon={(
            <Icon
              icon="ic:round-attach-money"
              className={`size-${sizeIcons}`}
            />
          )}
        >
          Orders
        </MenuItem>
        <MenuItem
          className="cursor-pointer transition-opacity duration-300 hover:opacity-50 "
          component={<Link href="/admin/products" />}
          icon={(
            <Icon
              icon="icon-park-outline:ad-product"
              className={`size-${sizeIcons}`}
            />
          )}
        >
          Products
        </MenuItem>
        <MenuItem
          className="cursor-pointer transition-opacity duration-300 hover:opacity-50 "
          component={<Link href="/admin/articles" />}
          icon={(
            <Icon
              icon="ic:round-auto-stories"
              className={`size-${sizeIcons}`}
            />
          )}
        >
          Stories
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
