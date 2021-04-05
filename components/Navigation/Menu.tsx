import cx from 'classnames';

import { MenuItem } from './MenuItem';
import { Typography } from '../Typography';
import { useAuth0 } from '@auth0/auth0-react';

interface MenuProps {
  open: boolean;
}

const menuItemsByRole = {
  admin: [
    { label: 'Clientes', route: 'customers' },
    { label: 'Equipe', route: 'team' },
    { label: 'Relatórios', route: 'reports' },
    { label: 'Agenda', route: 'schedule' },
  ],
};

export const Menu = ({ open }: MenuProps) => {
  const { user } = useAuth0();

  const navMenuClasses = cx(
    'flex-grow',
    'md:flex md:flex-col md:justify-between',
    'absolute md:relative',
    'w-screen md:w-64',
    'top-20 md:top-0',
    'px-4 py-4',
    'bg-white dark:bg-gray-800',
    'z-40',
    'overflow-y-auto',

    // Slide
    'transform-gpu transition-transform ease-in-out duration-700',
    'md:transform-none', // Disables Transform on larger screens
    { '-translate-y-full md:translate-y-0': !open },
    { 'translate-y-0': open }
  );

  return (
    <nav className={navMenuClasses}>
      <div>
        {menuItemsByRole[user[`${process.env.NEXT_PUBLIC_APP_DOMAIN}/roles`]].map(
          ({ label, route }: { label: string; route: string }) => (
            <MenuItem variant='link' href={`/${route.toLowerCase()}`} key={route}>
              <Typography variant='span'>{label}</Typography>
            </MenuItem>
          )
        )}
      </div>
    </nav>
  );
};

export default Menu;
