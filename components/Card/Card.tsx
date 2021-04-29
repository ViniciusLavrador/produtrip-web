import { FC, MouseEventHandler, ReactNode } from 'react';
import { CardImage } from './CardImage';
import { CardContent } from './CardContent';
import cx from 'classnames';

interface CardSubcomponents {
  Image: typeof CardImage;
  Content: typeof CardContent;
}
export interface CardProps {
  variant?: 'column' | 'row';
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const Card: FC<CardProps> & CardSubcomponents = ({ children, className, variant = 'column', onClick }) => {
  const rootClasses = cx(
    { 'flex flex-col': variant === 'column' },
    { 'flex flex-row': variant === 'row' },
    'rounded-lg',
    'overflow-hidden',
    'h-full w-full',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-white',
    'shadow-lg',
    className
  );

  return (
    <div className={rootClasses} onClick={onClick}>
      {children}
    </div>
  );
};

Card.Image = CardImage;
Card.Content = CardContent;

export default Card;
