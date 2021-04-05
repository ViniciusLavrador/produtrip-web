import Image from 'next/image';

import { Typography } from 'components/Typography';
import Link from 'next/link';

import cx from 'classnames';

export interface UserCardProps {
  user: any;
  href?: string;
}

export const UserCard = ({ user, href }: UserCardProps) => {
  const rootClasses = cx('flex flex-row', 'rounded', 'shadow-lg', 'h-48');
  const imageContainerClasses = cx('relative', 'w-48');
  const detailsContainerClasses = cx('flex flex-col justify-between', 'px-2 py-4', 'bg-white dark:bg-gray-800');

  console.log(href);

  return (
    <div className={rootClasses}>
      <div className={imageContainerClasses}>
        <Image
          src='https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          alt={user.name}
          layout='fill'
          objectFit='cover'
        />
      </div>

      <div className={detailsContainerClasses}>
        <div>
          <Typography variant='h1' bold className='text-sm'>
            {user.name}
          </Typography>
          <Typography variant='span' bold muted className='text-xs'>
            {user.email}
          </Typography>
        </div>
        <Typography variant='p' muted className='text-xs'>
          Ultimo Login: {new Date(user.last_login).toLocaleString()}
        </Typography>

        {href && (
          <div className='-mx-2 -my-4'>
            <Link href={href}>
              <div className='py-4 w-full text-center bg-yellow-300 cursor-pointer'>
                <Typography bold variant='span'>
                  Ver Mais
                </Typography>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
