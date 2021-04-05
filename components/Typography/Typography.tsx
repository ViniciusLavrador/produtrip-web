import { ReactNode } from 'react';
import cx from 'classnames';

interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  children: ReactNode;
  bold?: true;
  light?: true;
  muted?: true;
  className?: string;
}

export const Typography = ({ variant = 'h1', children, bold, light, muted, className }: TypographyProps) => {
  const hasSizingClass = className
    ? className.match(
        /text-xs|text-sm|text-base|text-lg|text-xl|text-2xl|text-3xl|text-4xl|text-5xl|text-6xl|text-7xl|text-8xl|text-9xl/
      )
    : false;

  const classes = cx(
    { 'font-light': light && !bold },
    { 'font-bold': bold && !light },
    { 'text-gray-500 dark:text-gray-400': muted },
    { 'text-gray-800 dark:text-white': !muted },
    { 'text-lg': variant == 'h6' && !hasSizingClass },
    { 'text-xl': variant == 'h5' && !hasSizingClass },
    { 'text-2xl': variant == 'h4' && !hasSizingClass },
    { 'text-3xl': variant == 'h3' && !hasSizingClass },
    { 'text-4xl': variant == 'h2' && !hasSizingClass },
    { 'text-5xl': variant == 'h1' && !hasSizingClass },
    { 'text-base': ['p', 'span'].includes(variant) && !hasSizingClass },
    className
  );

  switch (variant) {
    case 'h1':
      return <h1 className={classes}>{children}</h1>;
    case 'h2':
      return <h2 className={classes}>{children}</h2>;
    case 'h3':
      return <h3 className={classes}>{children}</h3>;
    case 'h4':
      return <h4 className={classes}>{children}</h4>;
    case 'h5':
      return <h5 className={classes}>{children}</h5>;
    case 'h6':
      return <h6 className={classes}>{children}</h6>;
    case 'p':
      return <p className={classes}>{children}</p>;
    case 'span':
      return <span className={classes}>{children}</span>;
  }
};

export default Typography;
