import cx from 'classnames';
import { Typography } from 'components/Typography';
import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEventHandler, ReactNode } from 'react';
import Link from 'next/link';

interface BaseButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  primary?: true;
  rounded?: true;
}

interface LabeledLinkButtonProps {
  label: string;
  children?: never;
  href: string;
  onClick?: never;
}

interface CustomizedLinkButtonProps {
  children: ReactNode;
  label?: never;
  href: string;
  onClick?: never;
}

interface LabeledButtonProps {
  label: string;
  children?: never;
  href?: never;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

interface CustomizedButtonProps {
  children: ReactNode;
  label?: never;
  href?: never;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

type ButtonProps = BaseButtonProps &
  (LabeledLinkButtonProps | CustomizedLinkButtonProps | LabeledButtonProps | CustomizedButtonProps);

export const Button = (props: ButtonProps) => {
  const { className, label, children, href, name, primary, rounded, ...buttonProps } = props;

  const buttonClasses = cx(
    { 'px-5 py-3': !rounded },
    { 'p-4': rounded },
    { 'rounded-lg': !rounded },
    { 'rounded-full': rounded },
    'focus:outline-none focus:shadow-outline',
    'shadow-xl active:shadow-none',
    'text-center',
    'cursor-pointer',
    { 'bg-yellow-300 hover:bg-yellow-400 disabled:hover:bg-yellow-300 text-gray-800': primary },
    { 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-500 text-white dark:text-gray-800': !primary },
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );

  if (href) {
    return (
      <>
        <Link href={href}>
          <div className={buttonClasses}>
            {label ? (
              <Typography variant='span' bold className='w-full text-white dark:text-gray-800'>
                {label}
              </Typography>
            ) : (
              children
            )}
          </div>
        </Link>
      </>
    );
  }

  return (
    <>
      <button className={buttonClasses} {...buttonProps}>
        {label ? (
          <Typography variant='span' bold className='w-full text-white dark:text-gray-800'>
            {label}
          </Typography>
        ) : (
          children
        )}
      </button>
    </>
  );
};

export default Button;
