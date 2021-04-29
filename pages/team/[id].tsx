import { useRouter } from 'next/router';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useApi } from 'hooks';
import { LoadingAnimation, Typography } from 'components';
import { toast } from 'react-toastify';
import { PencilSolidIcon } from 'public/icons/solid';
import cx from 'classnames';
import { ChangeEventHandler, useState } from 'react';
import axios from 'axios';

const ProfileImage = ({ src, uploadTo, revalidate }: { src: string; uploadTo: string; revalidate: any }) => {
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setLoading(true);

    if (!e.target.files.length) return;

    const imageTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (e.target.files.length > 1) return toast.warning('Selecione Apenas uma Imagem.');
    if (!imageTypes.includes(e.target.files[0].type)) return toast.warning('Formato de Imagem Invalido !');

    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const accessToken = await getAccessTokenSilently();

      await axios.put(uploadTo, formData, {
        headers: {
          Authentication: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      await revalidate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const rootClasses = cx(
    'relative',
    'flex items-center justify-center',
    'bg-white dark:bg-gray-800',
    'rounded',
    'shadow',

    'w-full md:w-48'
  );
  const iconClasses = cx(
    'w-6 h-6',
    'flex justify-center items-center',
    'rounded-full',
    'absolute right-2 top-2',
    'cursor-pointer',
    'transition-colors transform ',
    'bg-transparent hover:bg-yellow-300',
    'text-white hover:text-black'
  );
  const imageClasses = cx('rounded');

  return (
    <div className={rootClasses}>
      <label className={iconClasses} htmlFor='imageUploadButton'>
        <PencilSolidIcon className='w-4 h-4' />
      </label>
      <input type='file' id='imageUploadButton' style={{ display: 'none' }} onChange={handleImageChange} />
      <img src={src} className={imageClasses} style={{ objectFit: 'contain', objectPosition: 'center' }} />
      {loading && (
        <div className='absolute '>
          <LoadingAnimation size='2xs' />
        </div>
      )}
    </div>
  );
};

export interface TeamMemberProps {}

export const TeamMember = ({}: TeamMemberProps) => {
  const { query } = useRouter();

  let id = Buffer.from(query['id'] as string, 'base64').toString();
  let { data, isLoading, error, revalidate } = useApi(`auth/users/${id}`);

  if (error) {
    toast.error(error);
    return <LoadingAnimation size='2xl' />;
  }

  if (isLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  const user = data;

  return (
    <>
      <div className='flex flex-col md:flex-row-reverse gap-5'>
        <div className='w-full'>
          <Typography variant='h2' className='cols-span-2'>
            {user.name}
          </Typography>

          <Typography variant='h5'>@{user.nickname}</Typography>

          <a href={`mailto:${user.email}`}>
            <Typography variant='p' muted>
              {user.email}
            </Typography>
          </a>
        </div>

        <ProfileImage
          src={user.picture}
          uploadTo={`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/auth/users/${user.user_id}/profile-picture`}
          revalidate={revalidate}
        />
      </div>
    </>
  );
};

export default withAuthenticationRequired(TeamMember);
