import cx from 'classnames';
import { Typography, MenuItem, Avatar } from 'components';

import { useAuth0 } from '@auth0/auth0-react';
import {
  BriefcaseSolidIcon,
  UserGroupSolidIcon,
  ChartBarSolidIcon,
  CalendarSolidIcon,
  LogoutSolidIcon,
  MoonSolidIcon,
  SunSolidIcon,
  UserSolidIcon,
} from 'public/icons/solid';
import { ChevronUpOutlineIcon, ChevronDownOutlineIcon } from 'public/icons/outline';
import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeMode } from 'hooks';

interface ProfileRowProps {
  user: any;
  isOpen: boolean;
  toggleOpen(): void;
  expand?: true;
  children?: ReactNode;
}

export const Profile = ({ user, expand, isOpen, toggleOpen, children }: ProfileRowProps) => {
  const rootClasses = cx('border-b border-gray-300 dark:border-gray-600', 'mb-4');

  const profileContainerClasses = cx(
    'flex flex-row items-center',
    { 'justify-between': expand },
    { 'justify-center': !expand },
    'pt-0 pb-4 px-4 md:px-0 md:py-4',
    'bg-white dark:bg-gray-800',
    'cursor-pointer',
    'select-none'
  );
  const avatarClasses = cx('flex-shrink-0 hidden md:block');
  const textContainerClasses = cx('flex-col');
  const textClasses = cx('leading-none');
  const iconClasses = cx('w-6 h-6', 'flex-shrink-0 flex-grow-0', 'text-gray-800 dark:text-white');

  return (
    <div className={rootClasses}>
      <div className={profileContainerClasses} onClick={toggleOpen}>
        <div className={avatarClasses}>
          <Avatar src={user.picture} size='2xs' alt={`avatar de ${user.nickname}`} />
        </div>

        {expand && (
          <>
            <div className={textContainerClasses}>
              <div className={textClasses}>
                <Typography variant='span' className='text-base md:text-xs' light>
                  {user.name}
                </Typography>
              </div>

              <div className={textClasses}>
                <Typography variant='span' className='text-base md:text-xs' bold>
                  @{user.nickname}
                </Typography>
              </div>
            </div>
            {isOpen ? <ChevronUpOutlineIcon className={iconClasses} /> : <ChevronDownOutlineIcon className={iconClasses} />}
          </>
        )}
      </div>
      {children}
    </div>
  );
};

interface MenuProps {
  open: boolean;
  expand?: true;
}

export const Menu = ({ open, expand }: MenuProps) => {
  const { user, logout } = useAuth0();
  const { setDarkMode, setLightMode, currentMode } = useThemeMode();
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleTheme = () => {
    if (currentMode === 'dark') {
      setLightMode();
    } else if (currentMode === 'light') {
      setDarkMode();
    }
  };

  const menuItemsByRole: { [key: string]: MenuItem[] } = {
    ADMIN: [
      { variant: 'link', label: 'Clientes', href: '/customers', icon: <BriefcaseSolidIcon /> },
      { variant: 'link', label: 'Equipe', href: '/team', icon: <UserGroupSolidIcon /> },
      { variant: 'link', label: 'Relatórios', href: '/reports', icon: <ChartBarSolidIcon /> },
      { variant: 'link', label: 'Agenda', href: '/schedule', icon: <CalendarSolidIcon /> },
    ],
    USER: [
      { variant: 'link', label: 'Clientes', href: '/customers', icon: <BriefcaseSolidIcon /> },
      { variant: 'link', label: 'Equipe', href: '/team', icon: <UserGroupSolidIcon /> },
      { variant: 'link', label: 'Relatórios', href: '/reports', icon: <ChartBarSolidIcon /> },
      { variant: 'link', label: 'Agenda', href: '/schedule', icon: <CalendarSolidIcon /> },
    ],
  };

  const profileItemsByRole: { [key: string]: MenuItem[] } = {
    ADMIN: [
      {
        variant: 'button',
        label: 'Trocar Tema',
        onClick: toggleTheme,
        icon: currentMode === 'light' ? <MoonSolidIcon /> : <SunSolidIcon />,
      },
      { variant: 'link', label: 'Meu Perfil', href: '/me', icon: <UserSolidIcon /> },
      { variant: 'button', label: 'Sair', onClick: () => logout(), icon: <LogoutSolidIcon /> },
    ],
    USER: [
      {
        variant: 'button',
        label: 'Trocar Tema',
        onClick: toggleTheme,
        icon: currentMode === 'light' ? <MoonSolidIcon /> : <SunSolidIcon />,
      },
      { variant: 'link', label: 'Meu Perfil', href: '/me', icon: <UserSolidIcon /> },
      { variant: 'button', label: 'Sair', onClick: () => logout(), icon: <LogoutSolidIcon /> },
    ],
  };

  const navMenuClasses = cx(
    'flex flex-grow flex-col justify-between',
    'absolute md:relative',
    'top-20 md:top-0',
    'w-full',
    'p-4 md:p-0',
    'bg-white dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent', // Has to Exist so Mobile Menu Has Color
    'z-40',
    'overflow-y-auto',
    { shadow: open },

    // Slide
    'transform-gpu transition-transform ease-in-out duration-700',
    'md:transform-none', // Disables Transform on larger screens
    { '-translate-y-full md:translate-y-0': !open },
    { 'translate-y-0': open }
  );

  return (
    <nav className={navMenuClasses}>
      <div>
        <Profile expand={expand} user={user} isOpen={profileOpen} toggleOpen={() => setProfileOpen(!profileOpen)}>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ height: 0, marginTop: 0, marginBottom: 0 }}
                animate={{
                  height: 'auto',
                  marginTop: 8,
                  marginBottom: 8,
                }}
                exit={{ height: 0, marginTop: 0, marginBottom: 0 }}
                className='overflow-hidden'
              >
                {profileItemsByRole[user[Object.keys(user).filter((key) => /roles/)[0]]]?.map((menuItem) => (
                  <MenuItem key={(menuItem.href as string) || menuItem.label} menuItem={menuItem} expand={expand} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Profile>

        {menuItemsByRole[user[Object.keys(user).filter((key) => /roles/)[0]]]?.map((menuItem) => (
          <MenuItem menuItem={menuItem} expand={expand} key={(menuItem.href as string) || menuItem.label} />
        ))}
      </div>
    </nav>
  );
};

export default Menu;
