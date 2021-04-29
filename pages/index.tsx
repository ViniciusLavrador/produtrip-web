import { useRouter } from 'next/router';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import cx from 'classnames';
import { ExtendedLogo, Button, Logo } from '../components';
import { useEffect } from 'react';
import { Map } from 'components/Map/Map';

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
          <Button primary disabled onClick={redirectToPartners} label='Sou um Parceiro' />
        </div>
      </div>
    </div>
  );
};

const AuthenticatedHomePage = withAuthenticationRequired(() => {
  const { user } = useAuth0();
  const rootClasses = cx('w-full h-full flex justify-center items-center');
  return (
    <div className={rootClasses}>
      <Logo size='3xl' className='opacity-30' />
    </div>
  );
});

const HomePage = () => {
  const { isAuthenticated } = useAuth0();

  if (isAuthenticated) return <AuthenticatedHomePage />;
  if (!isAuthenticated) return <WelcomePage />;
};

export default HomePage;
