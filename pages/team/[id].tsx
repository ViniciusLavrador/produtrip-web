import { useRouter } from 'next/router';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useApi } from 'hooks';
import { Button, LoadingAnimation, Typography } from 'components';
import { toast } from 'react-toastify';
import { IdentificationSolidIcon, PencilSolidIcon } from 'public/icons/solid';
import cx from 'classnames';
import { ChangeEventHandler, useState } from 'react';
import axios from 'axios';
import { getUserRole } from 'helpers';
import Layout from 'components/Layout/Layout';
import { motion } from 'framer-motion';
import { useModal } from 'hooks/useModal';
import { useEffect } from 'react';

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
  const { getAccessTokenSilently } = useAuth0();
  const { openModal, closeModal } = useModal('changeRoleModal');

  const [updateRoleLoading, setUpdateRoleLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>();

  let id = Buffer.from(query['id'] as string, 'base64').toString();
  let { data: user, isLoading, error, revalidate } = useApi(`auth/users/${id}`);

  if (error) {
    toast.error(error);
    return <LoadingAnimation size='2xl' />;
  }

  if (isLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  const handleRoleChange = async () => {
    if (!currentRole) {
      return;
    }

    setUpdateRoleLoading(true);

    const accessToken = await getAccessTokenSilently({
      audience: process.env.NEXT_PUBLIC_API_AUTH0_AUDIENCE,
    });

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/auth/users/${user.user_id}/roles`,
        {
          role: currentRole,
        },
        {
          headers: { Authentication: `Bearer ${accessToken}` },
        }
      );

      toast.success('Função Alterada com Sucesso');
      setUpdateRoleLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao Alterar Função. Tente Novamente.');
    } finally {
      setUpdateRoleLoading(false);
      closeModal();
    }
  };

  return (
    <Layout>
      <Layout.Header />
      <Layout.Content>
        <div className='w-full flex flex-row gap-5'>
          <div>
            <ProfileImage
              src={user.picture}
              uploadTo={`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/auth/users/${user.user_id}/profile-picture`}
              revalidate={revalidate}
            />
          </div>
          <div>
            <Typography variant='h2' className='cols-span-2'>
              {user.name}
            </Typography>

            <Typography variant='h5' muted>
              @{user.nickname}
            </Typography>

            <a href={`mailto:${user.email}`}>
              <Typography variant='p' muted>
                {user.email}
              </Typography>
            </a>
          </div>
        </div>
        <div className='w-full flex flex-row justify-center mt-5'>
          <h1>ROLE: {getUserRole(user)}</h1>
        </div>
      </Layout.Content>
      <Layout.FABRow
        buttons={[
          {
            button: (
              <Button onClick={openModal} rounded primary>
                <IdentificationSolidIcon className='h-6 w-6' />
              </Button>
            ),
            tooltipContent: 'Trocar Função',
          },
        ]}
      />
      <Layout.Modal id='changeRoleModal' className='py-5 px-3'>
        <div className='flex flex-col'>
          <Typography variant='h4' bold>
            Função
          </Typography>
          <select
            value={currentRole || getUserRole(user)}
            onChange={(e) => setCurrentRole(e.target.value)}
            className=' focus:outline-none py-2 my-5 px-3 rounded border-2 w-full'
          >
            <option value='ADMIN'>ADMIN</option>
            <option value='USER'>USER</option>
          </select>
        </div>
        <div className='flex flex-row justify-end gap-3'>
          <Button label='Cancelar' onClick={closeModal} className='py-2' />
          <Button primary label='Salvar' onClick={handleRoleChange} className='py-2' />
        </div>
        {updateRoleLoading && (
          <div className='absolute w-full h-full top-auto left-auto'>
            <LoadingAnimation size='sm' />
          </div>
        )}
      </Layout.Modal>
    </Layout>
  );
};

export default withAuthenticationRequired(TeamMember);
