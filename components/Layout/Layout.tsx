import { BreadcrumbItemProps, Breadcrumbs } from 'components/Breadcrumbs';
import { ReactNode } from 'react';

// Layout Header
export interface LayoutHeaderProps {
  breadcrumb?: {
    list?: Omit<BreadcrumbItemProps, 'subtitle'>[];
    main: Omit<BreadcrumbItemProps, 'href'>;
  };
  children?: ReactNode;
}

export const LayoutHeader = ({ breadcrumb, children }: LayoutHeaderProps) => {
  return (
    <div className='w-full mb-5'>
      {breadcrumb && (
        <Breadcrumbs>
          {breadcrumb.list &&
            breadcrumb.list.map((item, index) => (
              <Breadcrumbs.ListItem key={index.toString()} title={item.title} href={item.href} />
            ))}
          <Breadcrumbs.MainItem title={breadcrumb.main.title} subtitle={breadcrumb.main.subtitle} />
        </Breadcrumbs>
      )}
      {children}
    </div>
  );
};

// Layout Content
export interface LayoutContentProps {
  children?: ReactNode;
}

export const LayoutContent = ({ children }: LayoutContentProps) => {
  return <div className='w-full'>{children}</div>;
};

// Layout Component
export interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <div className='h-full w-full'>{children}</div>;
};

Layout.Header = LayoutHeader;
Layout.Content = LayoutContent;

export default Layout;
