import { useRouter } from 'next/router';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { useApi } from 'hooks';
import { LoadingAnimation, UserCard } from 'components';
import { toast } from 'react-toastify';

export interface TeamMemberProps {}

export const TeamMember = ({}: TeamMemberProps) => {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useApi(`auth/users/${id}`);

  if (data) {
    console.log(data.data);
  }

  if (isLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  if (error) {
    toast.error('Tivemos um erro. 😓 Por Favor, tente novamente.', { toastId: 'apiError' });
  }

  return <div className='w-full h-full flex p-10'>{data && data.data && <UserCard user={data.data} />}</div>;
};

export default withAuthenticationRequired(TeamMember);
