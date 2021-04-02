import Link from 'next/link';
import { MouseEventHandler, ReactNode, useState } from 'react';
import { ExtendedLogo } from '../Logo';
import XIcon from '../../public/icons/outline/x.svg';
import MenuAlt3Icon from '../../public/icons/outline/menu-alt-3.svg';
import cx from 'classnames';

const SIDEBAR_WIDTH_CLASS = 'w-64';
const HEADER_HEIGHT_CLASS = 'h-20';

interface SidebarProps {
  children: ReactNode;
}

interface MobileDropButtonProps {
  open: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

/** Drop Menu Handler for Mobile Navbar */
const MobileDropButton = ({ onClick, open }: MobileDropButtonProps) => {
  const iconClasses = cx('w-6 h-6', 'text-gray-800 dark:text-white');

  return (
    <button className='md:hidden focus:outline-none focus:shadow-outline' onClick={onClick}>
      {open ? <XIcon className={iconClasses} /> : <MenuAlt3Icon className={iconClasses} />}
    </button>
  );
};

/** Navbar Logo & Brand */
const ClickableLogo = () => {
  return (
    <Link href='#'>
      <div className='cursor-pointer'>
        <ExtendedLogo direction='row' size='2xs' className='p-0 m-0 hidden md:flex' variant='both' />
        <ExtendedLogo direction='row' size='xs' className='p-0 m-0 md:hidden' variant='text' />
      </div>
    </Link>
  );
};

export const Navbar = ({ children }: SidebarProps) => {
  const [open, setOpen] = useState(false);

  const toggleOpenState = () => {
    setOpen(!open);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='flex flex-col flex-shrink-0 w-full min-h-20 justify-center md:justify-start md:w-64 md:h-screen bg-white dark:bg-gray-800'>
        <div className='flex flex-row items-center justify-between md:justify-center flex-shrink-0 px-8 py-4 md:px-0 h-20'>
          <ClickableLogo />
          <MobileDropButton open={open} onClick={toggleOpenState} />
        </div>
        <nav className='absolute w-screen md:w-64 top-20 h-96 flex-grow flex justify-between px-4 pb-4 md:block md:pb-0 md:overflow-y-auto bg-white dark:bg-gray-800'>
          <a
            href='#'
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
          >
            Teste
          </a>

          <a
            href='#'
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
          >
            Teste
          </a>

          <a
            href='#'
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
          >
            Teste
          </a>

          <a
            href='#'
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
          >
            Teste
          </a>

          <a
            href='#'
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
          >
            Teste
          </a>
        </nav>
        {/* <nav className='flex-grow px-4 pb-4 md:block md:pb-0 md:overflow-y-auto'>
          <a
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
            href='#'
          >
            Blog
          </a>
          <a
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
            href='#'
          >
            Portfolio
          </a>
          <a
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
            href='#'
          >
            About
          </a>
          <a
            className='block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
            href='#'
          >
            Contact
          </a>
          <div className='relative'>
            <button className='flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left bg-transparent rounded-lg dark:bg-transparent dark:focus:text-white dark:hover:text-white dark:focus:bg-gray-600 dark:hover:bg-gray-600 md:block hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'>
              <span>Dropdown</span>
              <svg
                fill='currentColor'
                viewBox='0 0 20 20'
                className='inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1'
              >
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </button>
            <div className='absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg'>
              <div className='px-2 py-2 bg-white rounded-md shadow dark:bg-gray-700'>
                <a
                  className='block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                  href='#'
                >
                  Link #1
                </a>
                <a
                  className='block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                  href='#'
                >
                  Link #2
                </a>
                <a
                  className='block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                  href='#'
                >
                  Link #3
                </a>
              </div>
            </div>
          </div>
        </nav> */}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Navbar;
