import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { ExtendedLogo } from '../Logo';
import cx from 'classnames';
import Menu from './Menu';
import { LogoutOptions, useAuth0 } from '@auth0/auth0-react';
import { MobileOpenButton } from './MobileOpenButton';
import { UrlObject } from 'url';
import Profile from './Profile';
import { Typography, Logo } from 'components';
import LoadingAnimation from 'components/LoadingAnimation/LoadingAnimation';

const COPYRIGHT_TEXT = 'BI4u is a product by 3eConsulting ©';

const LoadingAuthenticationPage = () => {
  return (
    <div className='h-screen w-screen'>
      <LoadingAnimation />
    </div>
  );
};

interface NavbarProps {
  children: ReactNode;
}

/** Navbar Logo & Brand */
interface ClickableLogoProps {
  href: string | UrlObject;
}
const ClickableLogo = ({ href }: ClickableLogoProps) => {
  return (
    <Link href={href}>
      <div className='cursor-pointer focus:outline-none focus:shadow-outline' tabIndex={0}>
        <ExtendedLogo direction='row' size='xs' className='p-0 m-0 md:flex' variant='both' />
      </div>
    </Link>
  );
};

export const Navbar = ({ children }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth0();

  const toggleOpenState = () => {
    setOpen(!open);
  };

  const rootClasses = cx('flex flex-col md:flex-row');
  const sidebarClasses = cx(
    'fixed md:fixed',
    'flex flex-col flex-shrink-0',
    'w-full min-h-20 md:w-64 md:h-screen',
    'bg-gray-50 dark:bg-gray-800',
    'z-10'
  );
  const headerClasses = cx(
    'flex flex-row items-center justify-between md:justify-center',
    'flex-shrink-0', // Disable Shrinking
    'px-8 py-4 md:px-0 h-20',
    'z-50',
    'bg-white dark:bg-gray-800',
    'border-b border-gray-300 dark:border-gray-600'
  );

  const footerClasses = cx(
    'hidden md:flex md:flex-row md:items-end md:justify-center',
    'flex-shrink-0', // Disable Shrinking
    'px-8 py-4 md:px-0 h-20',
    'z-50',
    'bg-white dark:bg-gray-800',
    'border-b border-gray-300 dark:border-gray-600'
  );

  const mainClasses = cx('overflow-x-hidden overflow-y-auto', 'mt-20 md:mt-0 ml-0 md:ml-64', 'min-h-screen w-full');

  if (isLoading) {
    return <LoadingAuthenticationPage />;
  }

  if (!isAuthenticated && !isLoading) {
    return <>{children}</>;
  }
  if (isAuthenticated && !isLoading) {
    return (
      <div className={rootClasses}>
        <div className={sidebarClasses}>
          <div className={headerClasses}>
            <ClickableLogo href='/' />
            <MobileOpenButton open={open} onClick={toggleOpenState} />
          </div>
          <Profile />
          <Menu open={open} />
          <div className={footerClasses}>
            <Typography variant='span' bold muted className='text-xs uppercase'>
              {COPYRIGHT_TEXT}
            </Typography>
          </div>
        </div>

        <main className={mainClasses}>{children}</main>
      </div>
    );
  }
};

export default Navbar;
