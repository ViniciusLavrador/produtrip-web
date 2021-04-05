import { Typography, LoadingAnimation, Button } from 'components';
import { useApi } from 'hooks';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { ChevronDownOutlineIcon } from 'public/icons/outline';
import UserCard from 'components/Card/UserCard';
import { withAuthenticationRequired } from '@auth0/auth0-react';

export interface TeamProps {}

export const Team = ({}: TeamProps) => {
  const { data, error, isLoading } = useApi(`auth/users`);

  if (isLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  if (error) {
    toast.error('Tivemos um erro. 😓 Por Favor, tente novamente.', { toastId: 'apiError' });
  }

  return (
    <div className='container p-10 grid grid-cols-1 md:grid-cols-3 gap-5'>
      {data && data.data.map((user: any) => <UserCard user={user} href={`/team/${user.user_id}`} key={user.user_id} />)}
    </div>
  );
};

export default withAuthenticationRequired(Team);
