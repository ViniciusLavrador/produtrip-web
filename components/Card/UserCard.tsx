import Link from 'next/link';
import { Card } from 'components/Card';
import { Typography } from 'components/Typography';
import { useContextMenu, Menu, Item, Separator, TriggerEvent, ItemParams } from 'react-contexify';
import cx from 'classnames';
import { useThemeMode } from 'hooks';
import { UserRemoveSolidIcon, FolderOpenSolidIcon } from 'public/icons/solid';
import { CheckOutlineIcon } from 'public/icons/outline';
import { MouseEventHandler } from 'react';
import { getUserRole } from 'helpers';

interface UserCardContextMenuProps {
  id: string;
  removeUser?(args: ItemParams<any, any>): void;
}

export const UserCardContextMenu = ({ id, removeUser }: UserCardContextMenuProps) => {
  const { currentMode } = useThemeMode();

  const iconClasses = cx('ml-4', 'w-4 h-4');
  const itemContainerClasses = cx('flex flex-row', 'justify-between items-center', 'w-full');

  return (
    <Menu id={id} theme={currentMode}>
      <Item onClick={removeUser}>
        <div className={itemContainerClasses}>
          Remover Colaborador
          <UserRemoveSolidIcon className={iconClasses} />
        </div>
      </Item>
      <Separator />
      <Item>
        <Link href={`/team/${Buffer.from(id).toString('base64')}`}>
          <div className={itemContainerClasses}>
            Ver Mais
            <FolderOpenSolidIcon className={iconClasses} />
          </div>
        </Link>
      </Item>
    </Menu>
  );
};

export interface BaseUserCardProps {
  user: any;
  variant?: 'column' | 'row';
  scaleOnHover?: true;
  className?: string;
  textOnly?: true;
  selected?: boolean;
  removeUser?(args: ItemParams<any, any>): void;
}

type UserCardProps = BaseUserCardProps &
  ({ linkToUser?: true; onClick?: never } | { onClick?: MouseEventHandler<HTMLDivElement>; linkToUser?: never });

export const UserCard = ({
  variant = 'column',
  user,
  linkToUser,
  onClick,
  scaleOnHover,
  className,
  textOnly,
  selected,
  removeUser,
}: UserCardProps) => {
  const base64ID = Buffer.from(user.user_id).toString('base64');
  const { show } = useContextMenu();

  const displayContextMenu = (e: TriggerEvent) => {
    e.stopPropagation();
    show(e, { id: user.user_id, props: { id: user.user_id } });
  };

  const rootClasses = cx(
    'relative',
    'transition-transform transform-gpu',
    'active:scale-95 active:shadow',
    'h-36',
    { 'active:shadow': linkToUser },
    { 'hover:scale-105': scaleOnHover },
    { 'ring-2 ring-yellow-300': selected },
    'overflow-visible',
    className
  );

  const iconContainerClasses = cx(
    'flex items-center justify-center',
    'w-8 h-8',
    'rounded-full',
    'absolute',
    '-right-2.5 -top-2.5',
    'bg-yellow-300'
  );

  const iconClasses = cx('w-5 h-5', 'stroke-current text-white dark:text-gray-900');
  const imageClasses = cx('bg-white', 'h-full', 'rounded-l-lg');
  const contentContainerClasses = cx('flex flex-col justify-evenly');

  const clickableCard = cx('h-full w-full', { 'cursor-pointer': typeof onClick === 'function' });

  const innerCard = (
    <Card variant={variant} className={rootClasses}>
      {selected && (
        <div className={iconContainerClasses}>
          <CheckOutlineIcon className={iconClasses} />
        </div>
      )}
      {!textOnly && (
        <div className='w-full h-full p-3'>
          <Card.Image src={user.picture} alt='logo' className={imageClasses} />
        </div>
      )}
      <Card.Content className={contentContainerClasses}>
        <Typography variant='span' bold>
          {user.name}
        </Typography>
        <Typography variant='span' bold muted className='text-xs'>
          {'Ultimo Login: '}
          {variant === 'row' && <br />}
          {user.last_login && user.last_login !== '' && new Date(user.last_login).toLocaleString()}
        </Typography>
      </Card.Content>
    </Card>
  );

  if (linkToUser) {
    return (
      <>
        <Link href={`/team/${base64ID}`}>
          <div className='w-full cursor-pointer group' onContextMenu={displayContextMenu}>
            {innerCard}
          </div>
        </Link>
        <UserCardContextMenu id={user.user_id} removeUser={removeUser} />
      </>
    );
  } else {
    return (
      <>
        <div className={clickableCard} onContextMenu={displayContextMenu} onClick={onClick}>
          {innerCard}
        </div>
        <UserCardContextMenu id={user.user_id} removeUser={removeUser} />
      </>
    );
  }
};

export default UserCard;
