import cx from 'classnames';
import Link from 'next/link';
import { UrlObject } from 'url';
import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

type MenuItemVariants = 'button' | 'link';

interface BaseMenuItemProps {
  children: ReactNode;
  className?: string;
  plain?: true;
}

interface MenuItemAsButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant: Extract<MenuItemVariants, 'button'>;
}

interface MenuItemAsLinkProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  variant: Extract<MenuItemVariants, 'link'>;
  href: string | UrlObject;
}

type MenuItemProps = BaseMenuItemProps & (MenuItemAsButtonProps | MenuItemAsLinkProps);

export const MenuItem = (props: MenuItemProps) => {
  const rootClasses = cx(
    'flex flex-row flex-shrink-0 flex-grow-0 justify-between',
    'px-4 py-2',
    'my-1',
    'rounded-lg',
    'bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 hover:bg-gray-200 focus:bg-gray-200',
    'focus:outline-none focus:shadow-outline',
    'hover:ring-2 hover:ring-yellow-300 hover:ring-opacity-40',
    'focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-100 focus:ring-offset-2 focus:ring-offset-yellow-100 ',
    'cursor-pointer',
    props.className
  );

  if (props.variant === 'link') {
    const { variant, href, className, plain, children, ...linkProps } = props;
    return (
      <Link href={href}>
        <div className={!plain ? rootClasses : className} tabIndex={0} {...linkProps}>
          {children}
        </div>
      </Link>
    );
  }

  if (props.variant === 'button') {
    const { variant, onClick, className, plain, children, ...buttonProps } = props;
    return (
      <button onClick={onClick} className={!plain ? rootClasses : className} tabIndex={0} {...buttonProps}>
        {children}
      </button>
    );
  }
};

export default MenuItem;
