import cx from 'classnames';
import Link from 'next/link';
import { UrlObject } from 'url';
import { MouseEventHandler, cloneElement } from 'react';
import { Typography } from 'components';
import Tooltip from 'components/Tooltip/Tooltip';
import { useThemeMode } from 'hooks';
import { AnimatePresence } from 'framer-motion';

type MenuItemVariants = 'button' | 'link';

export type MenuItem = {
  label: string;
  icon: JSX.Element;
} & (
  | {
      variant: Extract<MenuItemVariants, 'link'>;
      href: string | UrlObject;
      onClick?: never;
    }
  | { variant: Extract<MenuItemVariants, 'button'>; href?: never; onClick: MouseEventHandler<HTMLButtonElement> }
);

interface MenuItemProps {
  className?: string;
  plain?: true;
  menuItem: MenuItem;
  expand?: true;
}

export const MenuItem = ({ menuItem, className, plain, expand }: MenuItemProps) => {
  const rootClasses = cx(
    'group',
    'flex flex-row justify-start gap-5',
    { 'flex-shrink-0 flex-grow-0 rounded-lg px-4 py-2': expand },
    { 'w-max rounded-full p-3': !expand },
    'mx-1 my-2',
    'select-none',
    'bg-gray-200 dark:bg-gray-700',
    'hover:bg-yellow-500 dark:hover:bg-yellow-500',
    'focus:outline-none focus:shadow-outline',
    'cursor-pointer',
    className
  );
  const iconClasses = cx(
    'w-6 h-6',
    'flex-shrink-0 flex-grow-0',
    'text-gray-800 group-hover:text-white dark:text-white',
    'stroke-current stroke-0'
  );

  const textClasses = cx('text-gray-800 dark:text-white group-hover:text-white');

  const proppedIcon = cloneElement(menuItem.icon, { className: iconClasses });

  if (menuItem.variant === 'link') {
    const { label, href } = menuItem;
    return (
      <AnimatePresence>
        <Link href={href}>
          {expand ? (
            <div className={!plain ? rootClasses : className} tabIndex={0}>
              {proppedIcon}
              <Typography className={textClasses} variant='span'>
                {label}
              </Typography>
            </div>
          ) : (
            <span>
              <Tooltip content={label} arrow placement='right'>
                <div className={!plain ? rootClasses : className} tabIndex={0}>
                  {proppedIcon}
                </div>
              </Tooltip>
            </span>
          )}
        </Link>
      </AnimatePresence>
    );
  }

  if (menuItem.variant === 'button') {
    const { label, onClick } = menuItem;
    return (
      <button onClick={onClick} className='w-full'>
        {expand ? (
          <div className={!plain ? rootClasses + ' my-0' : className} tabIndex={0}>
            {proppedIcon}
            <Typography className={textClasses} variant='span'>
              {label}
            </Typography>
          </div>
        ) : (
          <Tooltip content={label} arrow placement='right'>
            <div className={!plain ? rootClasses + ' my-0' : className} tabIndex={0}>
              {proppedIcon}
            </div>
          </Tooltip>
        )}
      </button>
    );
  }
};

export default MenuItem;
