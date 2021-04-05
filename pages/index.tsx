import { useRouter } from 'next/router';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import cx from 'classnames';
import { ExtendedLogo, Logo, Avatar, Button, Typography } from '../components';
import { useEffect } from 'react';
import { getUserRoles } from 'helpers';

const PARTNERS_LOGIN_URL = '/partners/login';

const WelcomePage = () => {
  const { loginWithRedirect } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(PARTNERS_LOGIN_URL);
  }, []);

  const redirectToPartners = () => {
    router.push(PARTNERS_LOGIN_URL);
  };

  const rootClasses = cx('flex', 'h-screen w-screen', 'justify-center items-center');
  const welcomeContainerClasses = cx(
    'flex flex-col',
    'max-w-xs md:max-w-none',
    'gap-5',
    'py-5',
    'px-0 md:px-10',
    'border-2  rounded-3xl border-gray-300 dark:border-gray-600',
    'bg-white dark:bg-gray-800',
    'shadow-lg'
  );
  const actionRow = cx('flex flex-col md:flex-row', 'gap-5', 'py-10 px-10 md:px-0');

  return (
    <div className={rootClasses}>
      <div className={welcomeContainerClasses}>
        <div className='hidden md:block'>
          <ExtendedLogo />
        </div>
        <div className='md:hidden'>
          <ExtendedLogo size='xs' />
        </div>
        <div className={actionRow}>
          <Button primary onClick={loginWithRedirect} label='Sou um Colaborador' />
          <Button primary onClick={redirectToPartners} label='Sou um Parceiro' />
        </div>
      </div>
    </div>
  );
};

const AuthenticatedHomePage = withAuthenticationRequired(() => {
  const { user } = useAuth0();

  let roles = user[`${process.env.NEXT_PUBLIC_APP_DOMAIN}/roles`] as string[];

  return (
    <div className='flex flex-col p-5 w-full h-full'>
      <Typography variant='h2'>{roles}</Typography>
      <Avatar
        size='md'
        src='https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        alt='trial avatar'
      />
      <Avatar size='md' src={user.picture} alt='trial avatar' />
    </div>
  );
});

const HomePage = () => {
  const { isAuthenticated } = useAuth0();

  if (isAuthenticated) return <AuthenticatedHomePage />;
  if (!isAuthenticated) return <WelcomePage />;
};

export default HomePage;
