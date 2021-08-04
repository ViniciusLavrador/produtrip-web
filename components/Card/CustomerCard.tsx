import Link from 'next/link';
import { Card } from 'components/Card';
import { Typography } from 'components/Typography';
import { useContextMenu, Menu, Item, Separator, TriggerEvent, ItemParams } from 'react-contexify';
import cx from 'classnames';
import { useThemeMode } from 'hooks';
import { UserRemoveSolidIcon, FolderOpenSolidIcon } from 'public/icons/solid';
import { CheckOutlineIcon } from 'public/icons/outline';
import { MouseEventHandler } from 'react';

interface CustomerCardContextMenuProps {
  id: string;
  removeCustomer?(args: ItemParams<any, any>): void;
}

export const CustomerCardContextMenu = ({ id, removeCustomer }: CustomerCardContextMenuProps) => {
  const { currentMode } = useThemeMode();

  const iconClasses = cx('ml-4', 'w-4 h-4');
  const itemContainerClasses = cx('flex flex-row', 'justify-between items-center', 'w-full');

  return (
    <Menu id={id} theme={currentMode}>
      <Item onClick={removeCustomer}>
        <div className={itemContainerClasses}>
          Remover Cliente
          <UserRemoveSolidIcon className={iconClasses} />
        </div>
      </Item>
      <Separator />
      <Item>
        <Link href={`/customers/${Buffer.from(id).toString('base64')}`}>
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
  customer: any;
  variant?: 'column' | 'row';
  scaleOnHover?: true;
  className?: string;
  textOnly?: true;
  selected?: boolean;
  removeCustomer?(args: ItemParams<any, any>): void;
}

type CustomerCardProps = BaseUserCardProps &
  ({ linkToCustomer?: true; onClick?: never } | { onClick?: MouseEventHandler<HTMLDivElement>; linkToCustomer?: never });

export const CustomerCard = ({
  variant = 'column',
  customer,
  linkToCustomer,
  onClick,
  scaleOnHover,
  className,
  textOnly,
  selected,
  removeCustomer,
}: CustomerCardProps) => {
  const base64ID = Buffer.from(customer.id).toString('base64');
  const { show } = useContextMenu();

  const displayContextMenu = (e: TriggerEvent) => {
    e.stopPropagation();
    show(e, { id: customer.id, props: { id: customer.id } });
  };

  const rootClasses = cx(
    'flex flex-col',
    'relative',
    'transition-transform transform-gpu',
    'active:scale-95 active:shadow',
    { 'active:shadow': linkToCustomer },
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
  const imageClasses = cx('bg-white', 'h-20');
  const contentContainerClasses = cx('flex flex-col justify-evenly');

  const clickableCard = cx('h-full w-full', { 'cursor-pointer': typeof onClick === 'function' });

  const innerCard = (
    <Card variant={variant} className={rootClasses}>
      {selected && (
        <div className={iconContainerClasses}>
          <CheckOutlineIcon className={iconClasses} />
        </div>
      )}
      {!textOnly && customer.image && (
        <div className='w-full h-full p-3'>
          <Card.Image src={customer.image} alt='logo' className={imageClasses} />
        </div>
      )}
      <Card.Content className={contentContainerClasses}>
        <Typography variant='span' bold>
          {customer.name}
        </Typography>
        <Typography variant='span' bold muted className='text-xs'>
          {customer.CNPJ}
        </Typography>
      </Card.Content>
    </Card>
  );

  if (linkToCustomer) {
    return (
      <>
        <Link href={`/customers/${base64ID}`}>
          <div className='w-full cursor-pointer group' onContextMenu={displayContextMenu}>
            {innerCard}
          </div>
        </Link>
        <CustomerCardContextMenu id={customer.id} removeCustomer={removeCustomer} />
      </>
    );
  } else {
    return (
      <>
        <div className={clickableCard} onContextMenu={displayContextMenu} onClick={onClick}>
          {innerCard}
        </div>
        <CustomerCardContextMenu id={customer.id} removeCustomer={removeCustomer} />
      </>
    );
  }
};

export default CustomerCard;
