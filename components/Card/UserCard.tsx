import Link from 'next/link';
import { Card } from 'components/Card';
import { Typography } from 'components/Typography';
import cx from 'classnames';

export interface UserCardProps {
  user: any;
  variant?: 'column' | 'row';
  linkToUser?: true;
  scaleOnHover?: true;
  className?: string;
  textOnly?: true;
}

export const UserCard = ({ variant = 'column', user, linkToUser, scaleOnHover, className, textOnly }: UserCardProps) => {
  const rootClasses = cx(
    { 'active:shadow-none': linkToUser },
    { 'transition-transform transform-gpu hover:scale-105': scaleOnHover },
    className
  );

  const innerCard = (
    <Card variant={variant} className={rootClasses}>
      {!textOnly && <Card.Image src='/images/logo.png' alt='logo' className='bg-white h-full' />}
      <Card.Content className='flex flex-col justify-around'>
        <Typography variant='span' bold>
          {user.name}
        </Typography>
        <Typography variant='span' bold muted className='text-xs'>
          {'Ultimo Login: '}
          {variant === 'row' && <br />}
          {new Date(user.last_login).toLocaleString()}
        </Typography>
      </Card.Content>
    </Card>
  );

  if (linkToUser) {
    return (
      <Link href={`/team/${Buffer.from(user.user_id).toString('base64')}`}>
        <div className='w-full cursor-pointer group'>{innerCard}</div>
      </Link>
    );
  } else {
    return <div className='w-full h-full'>{innerCard}</div>;
  }
};

export default UserCard;
