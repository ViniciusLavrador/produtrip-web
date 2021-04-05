import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Avatar, Typography } from 'components';
import { useApi } from '../hooks/useAPI';

export const MePage = () => {
  const { user } = useAuth0();

  return (
    <div className='flex flex-col w-full h-full justify-center items-center gap-5'>
      <Avatar src={user.picture} size='lg' alt={`avatar ${user.nickname}`} />

      <div className='text-center'>
        <Typography variant='h3' className='font-light'>
          {user.name}
        </Typography>
        <Typography variant='span' bold>
          @{user.nickname}
        </Typography>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(MePage);
