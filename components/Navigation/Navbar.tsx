import ResizeObserver from 'resize-observer-polyfill';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { ExtendedLogo } from '../Logo';
import cx from 'classnames';
import Menu from './Menu';
import { useAuth0 } from '@auth0/auth0-react';
import { MobileOpenButton } from './MobileOpenButton';
import { UrlObject } from 'url';
import { Typography, Logo } from 'components';
import LoadingAnimation from 'components/LoadingAnimation/LoadingAnimation';
import { ChevronRightOutlineIcon, ChevronLeftOutlineIcon } from 'public/icons/outline';

const COPYRIGHT_TEXT = 'Gestão de PDV is a product by 3eConsulting ©';

const LoadingAuthenticationPage = () => {
  return (
    <div className='h-screen w-screen'>
      <LoadingAnimation />
    </div>
  );
};

/** Navbar Logo & Brand */
interface ClickableLogoProps {
  href: string | UrlObject;
  expand?: true;
}

const ClickableLogo = ({ href, expand }: ClickableLogoProps) => {
  return (
    <Link href={href}>
      <div className='cursor-pointer focus:outline-none focus:shadow-outline mx-1' tabIndex={0}>
        {expand ? <ExtendedLogo direction='row' size='xs' className='p-0 md:-mx-4 md:flex' variant='both' /> : <Logo size='xs' />}
      </div>
    </Link>
  );
};

interface NavbarProps {
  children: ReactNode;
}

export const Navbar = ({ children }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [expand, setExpand] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    function onResize([entry]) {
      if (entry.contentRect.width < 768) {
        setExpand(true);
        setIsMobile(true);
      } else {
        setExpand(false);
        setIsMobile(false);
      }
    }

    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleOpenState = () => {
    setOpen(!open);
  };

  const toggleExpandedState = () => {
    setExpand(!expand);
  };

  const rootClasses = cx('flex flex-col md:flex-row');
  const sidebarClasses = cx(
    'fixed md:relative',
    'flex flex-col',
    'md:px-4 ',
    { 'w-full min-h-20 md:w-80 md:h-screen': expand },
    { 'md:h-screen md:w-max': !expand },
    'bg-white dark:bg-gray-800',
    'z-10'
  );
  const headerClasses = cx(
    'relative',
    { 'flex flex-row items-center justify-between md:justify-center': expand },
    'w-screen md:w-full',
    'py-4 px-8 md:px-0 h-20',
    'z-50',
    'bg-white dark:bg-gray-800', // Has to exist so it overlaps Closed Components
    'border-b border-gray-300 dark:border-gray-600',
    'shadow md:shadow-none'
  );

  const footerClasses = cx(
    'hidden md:flex md:flex-row md:items-end md:justify-center',
    'flex-shrink-0', // Disable Shrinking
    'px-8 py-4 md:px-0 h-20',
    'z-50',
    'bg-white dark:bg-gray-800',
    'border-b border-gray-300 dark:border-gray-600'
  );

  const mainClasses = cx('overflow-x-hidden overflow-y-auto', 'p-10', 'mt-20', 'md:mt-0', 'min-h-screen w-full');

  const expandButtonClasses = cx('p-1 rounded-full absolute -right-7 bg-yellow-300', 'focus:outline-none focus:shadow-none');
  const expandIconClasses = cx('h-4 w-4');

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
            <ClickableLogo href='/' expand={expand ? true : undefined} />
            <MobileOpenButton open={open} onClick={toggleOpenState} />
            {!isMobile && (
              <button onClick={toggleExpandedState} className={expandButtonClasses}>
                {expand ? (
                  <ChevronLeftOutlineIcon className={expandIconClasses} />
                ) : (
                  <ChevronRightOutlineIcon className={expandIconClasses} />
                )}
              </button>
            )}
          </div>
          <Menu open={open} expand={expand ? true : undefined} />

          {expand && (
            <div className={footerClasses}>
              <Typography variant='span' bold muted className='text-2xs uppercase'>
                {COPYRIGHT_TEXT}
              </Typography>
            </div>
          )}
        </div>

        <main className={mainClasses}>{children}</main>
      </div>
    );
  }
};

export default Navbar;
