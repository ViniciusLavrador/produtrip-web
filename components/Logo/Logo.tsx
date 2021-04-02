import { HTMLAttributes } from 'react';
import cx from 'classnames';
import Image from 'next/image';

export interface LogoProps {
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  className?: string;
}

export const Logo = ({ size = 'md', className }: LogoProps) => {
  const rootClasses = cx(
    'rounded-full',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'bg-yellow-300',
    { 'w-10 h-10 p-1': size == '2xs' },
    { 'w-12 h-12 p-1': size == 'xs' },
    { 'w-20 h-20 p-2': size == 'sm' },
    { 'w-32 h-32 p-3': size == 'md' },
    { 'w-40 h-40 p-4': size == 'lg' },
    { 'w-52 h-52 p-5': size == 'xl' },
    { 'w-60 h-60 p-6': size == '2xl' },
    { 'w-72 h-72 p-7': size == '3xl' },
    { 'w-80 h-80 p-8': size == '4xl' },
    { 'w-96 h-96 p-10': size == '5xl' },
    className
  );

  return (
    <div className={rootClasses}>
      <div className='relative w-full h-full'>
        <Image src='/images/logo.png' layout='fill' objectFit='contain' />
      </div>
    </div>
  );
};

export default Logo;
