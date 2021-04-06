import { Typography, LoadingAnimation, Button } from 'components';
import { useApi } from 'hooks';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { ChevronDownOutlineIcon, SumOutlineIcon, UserGroupOutlineIcon } from 'public/icons/outline';
import UserCard from 'components/Card/UserCard';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { UserGroupSolidIcon, UserSolidIcon } from 'public/icons/solid';

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
    <>
      {/* <Typography variant='h3' className='pb-10 flex flex-row items-center'>
        <UserGroupSolidIcon className='w-14 h-14 p-2 mr-5 bg-yellow-300 rounded-full' />
        Nossa Equipe
      </Typography> */}
      <div className='container grid grid-cols-1 md:grid-cols-4 gap-5'>
        {data && data.data.map((user: any) => <UserCard user={user} key={user.user_id} variant='row' linkToUser scaleOnHover />)}
        {data && data.data.map((user: any) => <UserCard user={user} key={user.user_id} variant='row' linkToUser scaleOnHover />)}
        {data && data.data.map((user: any) => <UserCard user={user} key={user.user_id} variant='row' linkToUser scaleOnHover />)}
        {data && data.data.map((user: any) => <UserCard user={user} key={user.user_id} variant='row' linkToUser scaleOnHover />)}
        {data && data.data.map((user: any) => <UserCard user={user} key={user.user_id} variant='row' linkToUser scaleOnHover />)}
        {data && data.data.map((user: any) => <UserCard user={user} key={user.user_id} variant='row' linkToUser scaleOnHover />)}
        {data && data.data.map((user: any) => <UserCard user={user} key={user.user_id} variant='row' linkToUser scaleOnHover />)}
        {data && data.data.map((user: any) => <UserCard user={user} key={user.user_id} variant='row' linkToUser scaleOnHover />)}
      </div>
      <Button primary onClick={() => {}} rounded className='fixed bottom-10 right-10'>
        <SumOutlineIcon className='h-6 w-6' />
      </Button>
    </>
  );
};

export default withAuthenticationRequired(Team);
