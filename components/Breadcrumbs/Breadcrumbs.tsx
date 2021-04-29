import { Typography } from 'components';
import Link from 'next/link';
import { ReactNode, Children, isValidElement } from 'react';

export interface BreadcrumbsProps {
  children: ReactNode;
}

export interface BreadcrumbItemProps {
  title: string;
  subtitle?: string;
  href?: string;
}

const BreadcrumbListItem = ({ title, href }: Omit<BreadcrumbItemProps, 'subtitle'>) => {
  return (
    <>
      {href ? (
        <Link href={href}>
          <span>
            <Typography
              variant='span'
              className='cursor-pointer transition-colors hover:text-yellow-300 dark:hover:text-yellow-300'
              bold
              muted
            >
              {title}
            </Typography>
          </span>
        </Link>
      ) : (
        <Typography variant='span' bold muted>
          {title}
        </Typography>
      )}
      <Typography variant='span' muted>
        {' / '}
      </Typography>
    </>
  );
};

const BreadcrumbMainItem = ({ title, subtitle }: Omit<BreadcrumbItemProps, 'href'>) => {
  return (
    <>
      <Typography variant='h2'>{title}</Typography>
      <Typography variant='span' bold muted className='ml-1'>
        {subtitle}
      </Typography>
    </>
  );
};

export const Breadcrumbs = ({ children }: BreadcrumbsProps) => {
  return (
    <>
      {Children.map(children, (child) => {
        if (isValidElement(child) && (child.type == BreadcrumbMainItem || child.type == BreadcrumbListItem)) {
          return child;
        }
      })}
    </>
  );
};

Breadcrumbs.ListItem = BreadcrumbListItem;
Breadcrumbs.MainItem = BreadcrumbMainItem;

export default Breadcrumbs;
