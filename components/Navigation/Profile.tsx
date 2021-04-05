import cx from 'classnames';
import { Avatar } from 'components/Avatar';
import { Typography } from 'components/Typography';

import {
  ChevronDownOutlineIcon,
  ChevronUpOutlineIcon,
  UserOutlineIcon,
  SunOutlineIcon,
  MoonOutlineIcon,
} from 'public/icons/outline';
import { LogoutSolidIcon } from 'public/icons/solid';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import { useThemeMode } from 'hooks';

const ThemeSelector = () => {
  const { setDarkMode, setLightMode, currentMode } = useThemeMode();
  const iconClasses = cx(
    'w-6 h-6',
    'flex-shrink-0 flex-grow-0',
    'text-gray-800 group-hover:text-white dark:text-white',
    'stroke-current stroke-0'
  );

  const onClick = () => {
    if (currentMode === 'dark') {
      setLightMode();
    } else if (currentMode === 'light') {
      setDarkMode();
    }
  };

  return (
    <MenuItem variant='button' onClick={onClick}>
      <Typography variant='span'>Trocar Tema</Typography>
      {currentMode == 'light' ? <MoonOutlineIcon className={iconClasses} /> : <SunOutlineIcon className={iconClasses} />}
    </MenuItem>
  );
};

export interface ProfileSubmenuProps {
  open: boolean;
  className?: string;
}

export const ProfileSubmenu = ({ open, className }: ProfileSubmenuProps) => {
  const { logout } = useAuth0();

  const rootClasses = cx(
    'transition-all height ease-in-out duration-700',
    { 'h-0': !open },
    { 'h-40 ': open },
    'flex flex-col justify-center',
    'px-4',
    { 'border-b border-gray-300 border-dashed dark:border-gray-600': open },
    className
  );

  const iconClasses = cx(
    'w-6 h-6',
    'flex-shrink-0 flex-grow-0',
    'text-gray-800 group-hover:text-white dark:text-white',
    'stroke-current stroke-0'
  );

  const logoutmenuItemClasses = cx(
    'group',
    'hover:bg-red-500 hover:ring-0 hover:md:ring-0',
    'focus:bg-red-700 focus:ring-0 focus:md:ring-0'
  );

  return (
    <div className={rootClasses}>
      <ThemeSelector />
      <MenuItem variant='link' href='/me'>
        <Typography variant='span'>Meu Perfil</Typography>
        <UserOutlineIcon className={iconClasses} />
      </MenuItem>
      <MenuItem variant='button' onClick={() => logout()} className={logoutmenuItemClasses}>
        <Typography variant='span' className='group-hover:text-white'>
          Sair
        </Typography>
        <LogoutSolidIcon className={iconClasses} />
      </MenuItem>
    </div>
  );
};

export interface ProfileProps {}

export const Profile = (props: ProfileProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth0();

  const rootClasses = cx(
    'hidden md:flex', // Hide on Mobile
    'gap-x-4',
    'flex-row items-center justify-between',
    'flex-shrink-0', // Disable Shrinking
    'flex-grow-0',
    'pl-4 py-4 h-20',
    'bg-white dark:bg-gray-800',
    'border-b border-gray-300 dark:border-gray-600'
  );

  const avatarClasses = cx('flex-shrink-0');
  const textContainerClasses = cx('flex-col');
  const textClasses = cx('leading-none');
  const iconClasses = cx('w-6 h-6', 'flex-shrink-0 flex-grow-0', 'mr-2', 'text-gray-800 dark:text-white', 'cursor-pointer');

  return (
    <>
      <ProfileSubmenu open={open} className='hidden md:flex md:flex-col' />
      <div className={rootClasses}>
        <div className={avatarClasses}>
          <Avatar src={user.picture} size='2xs' alt={`avatar de ${user.nickname}`} />
        </div>

        <div className={textContainerClasses}>
          <div className={textClasses}>
            <Typography variant='span' className='text-xs' light>
              {user.name}
            </Typography>
          </div>

          <div className={textClasses}>
            <Typography variant='span' className='text-xs' bold>
              @{user.nickname}
            </Typography>
          </div>
        </div>
        {open ? (
          <ChevronUpOutlineIcon className={iconClasses} onClick={() => setOpen(!open)} />
        ) : (
          <ChevronDownOutlineIcon className={iconClasses} onClick={() => setOpen(!open)} />
        )}
      </div>
    </>
  );
};

export default Profile;
