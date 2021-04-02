import Logo from './Logo';
import cx from 'classnames';
import { Typography } from '../Typography';

interface ExtendedLogoProps {
  direction?: 'row' | 'column';
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  className?: string;
  variant?: 'logo' | 'text' | 'both';
}

export const ExtendedLogo = ({ direction = 'row', size = 'sm', variant = 'both', className }: ExtendedLogoProps) => {
  const rootClasses = cx(
    'flex items-center justify-center',
    'p-5',
    { 'space-y-5 flex-col': direction === 'column' },
    { 'space-x-5 flex-row': direction === 'row' },
    className
  );

  const titleClasses = cx(
    'leading-none',
    'tracking-widest',
    'uppercase',
    'font-semibold',
    { 'text-base': size == '2xs' },
    { 'text-lg': size == 'xs' },
    { 'text-2xl': size == 'sm' },
    { 'text-3xl': size == 'md' },
    { 'text-4xl': size == 'lg' },
    { 'text-5xl': size == 'xl' },
    { 'text-6xl': size == '2xl' },
    { 'text-7xl': size == '3xl' },
    { 'text-8xl': size == '4xl' },
    { 'text-9xl': size == '5xl' }
  );

  const subtitleClasses = cx(
    'leading-none',
    'text-right',
    { 'text-xs': size == '2xs' },
    { 'text-xs': size == 'xs' },
    { 'text-sm': size == 'sm' },
    { 'text-base': size == 'md' },
    { 'text-lg': size == 'lg' },
    { 'text-xl': size == 'xl' },
    { 'text-2xl': size == '2xl' },
    { 'text-3xl': size == '3xl' },
    { 'text-4xl': size == '4xl' },
    { 'text-5xl': size == '5xl' }
  );

  return (
    <div className={rootClasses}>
      {['logo', 'both'].includes(variant) && <Logo size={size} />}
      {['text', 'both'].includes(variant) && (
        <div className='flex flex-col'>
          <Typography variant='h1' className={titleClasses}>
            Gestão de PDV
          </Typography>
          <Typography variant='h2' className={subtitleClasses} muted>
            powered by{' '}
            <Typography variant='span' className={subtitleClasses} muted bold>
              BI4u
            </Typography>
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ExtendedLogo;
