import { MouseEventHandler } from 'react';
import XIcon from '../../public/icons/outline/x.svg';
import MenuAlt3Icon from '../../public/icons/outline/menu-alt-3.svg';
import cx from 'classnames';

interface MobileOpenButtonProps {
  open: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const MobileOpenButton = ({ onClick, open }: MobileOpenButtonProps) => {
  const iconClasses = cx('w-6 h-6', 'text-gray-800 dark:text-white');

  return (
    <button className='md:hidden focus:outline-none focus:shadow-outline' onClick={onClick} tabIndex={-1}>
      {open ? <XIcon className={iconClasses} tabIndex={0} /> : <MenuAlt3Icon className={iconClasses} tabIndex={0} />}
    </button>
  );
};

export default MobileOpenButton;
