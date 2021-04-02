import Link from 'next/link';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Navigation from '../../components/OLD/Navigation';

export const AdminHome = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <>
      <h1>{isAuthenticated ? 'true' : 'false'}</h1>
      <Link href='/'>Home</Link>
    </>
  );
};

export default withAuthenticationRequired(AdminHome);
