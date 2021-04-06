import { useRouter } from 'next/router';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { useApi } from 'hooks';
import { Button, LoadingAnimation, UserCard } from 'components';
import { toast } from 'react-toastify';
import { SumOutlineIcon } from 'public/icons/outline';

export interface TeamMemberProps {}

export const TeamMember = ({}: TeamMemberProps) => {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useApi(`auth/users/${Buffer.from(id as string, 'base64').toString('ascii')}`);

  if (data) {
    console.log(data.data);
  }

  if (isLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  if (error) {
    toast.error('Tivemos um erro. 😓 Por Favor, tente novamente.', { toastId: 'apiError' });
  }

  return (
    <>
      <div className='h-max'>{data && data.data && <UserCard user={data.data[0]} variant='column' textOnly />}</div>
    </>
  );
};

export default withAuthenticationRequired(TeamMember);
