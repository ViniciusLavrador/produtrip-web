import cx from 'classnames';
import { ReactNode } from 'react';

type PossiblePresets = 'header' | 'footer' | 'actionRow';

export interface CardContentProps {
  preset?: PossiblePresets;
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className, preset }: CardContentProps) => {
  const baseClasses = cx('w-full h-max', 'p-4', className);
  const presetClasses = {
    header: cx('w-full h-max', 'p-2', 'flex flex-row justify-between', className),
    footer: cx('w-full h-max', 'p-2', 'flex flex-row justify-between', className),
    actionRow: cx(
      'w-full h-max',
      'p-4',
      'flex flex-row justify-between',
      'border-t-2 border-gray-100 dark:border-gray-600',
      className
    ),
  };

  return <div className={preset ? presetClasses[preset] : baseClasses}>{children}</div>;
};

export default CardContent;
