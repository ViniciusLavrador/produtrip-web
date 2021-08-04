import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useApi } from 'hooks';
import { Button, LoadingAnimation, Tooltip, Typography } from 'components';
import { DuplicateSolidIcon, PencilSolidIcon } from 'public/icons/solid';
import { toast } from 'react-toastify';

import cx from 'classnames';

import { DuplicateOutlineIcon, SumOutlineIcon } from 'public/icons/outline';
import { Map } from 'components/Map';
import { ChangeEventHandler, useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from 'components/Layout/Layout';
import useClipboard from 'hooks/useClipboard';
import axios from 'axios';

export interface CustomerProps {}

export const Customer = ({}: CustomerProps) => {
  const { query } = useRouter();
  let id = Buffer.from(query['id'] as string, 'base64').toString();

  // API
  let {
    data: company,
    isLoading: companyLoading,
    error: companyError,
    revalidate: revalidateCompany,
  } = useApi(`companies/${id}`);
  let { data: projectsData, isLoading: projectsLoading, error: projectsError } = useApi(`companies/${id}/projects`);
  let { data: posData, isLoading: posLoading, error: posError, revalidate } = useApi(`companies/${id}/pos`);

  // Internal State
  const [mapFocus, setMapFocus] = useState<{ latitude: number; longitude: number; zoom?: number }>({
    latitude: -14.2401,
    longitude: -53.1805,
    zoom: 3,
  });
  const [currentView, setCurrentView] = useState<'Pontos de Venda' | 'Projetos'>('Pontos de Venda');
  const [loading, setLoading] = useState(false);

  // Hooks
  const { copy: toClipboard } = useClipboard(true);
  const { getAccessTokenSilently } = useAuth0();

  // Functions
  const focusMapOn = (pos: any) => {
    if (pos.address) {
      setMapFocus({
        latitude: parseFloat(pos.address.lat),
        longitude: parseFloat(pos.address.lng),
        zoom: 13,
      });
    }
  };

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

      await axios.put(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/companies/${company.id}/image`, formData, {
        headers: {
          Authentication: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      await revalidateCompany();
      toast.success('Imagem alterada com sucesso');
    } catch (err) {
      toast.error('Erro ao alter a imagem. Tente novamente !');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CSS
  const iconClasses = cx('h-6 w-6');
  const editIconClasses = cx(
    'w-6 h-6',
    'flex justify-center items-center',
    'rounded-full',
    'absolute right-0 top-0',
    'cursor-pointer',
    'transition-colors transform ',
    'bg-transparent hover:bg-yellow-300',
    'text-white hover:text-black'
  );

  // Render
  if (companyError || posError || projectsError) {
    toast.error(companyError || posError || projectsError);
    return <LoadingAnimation size='2xl' />;
  }

  if (companyLoading || posLoading || projectsLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  const POSMarker = ({ pos, active }: { pos: any; active: boolean }) => (
    <Map.Marker active={active} longitude={parseFloat(pos.address.lng)} latitude={parseFloat(pos.address.lat)}>
      <Typography variant='span' className='text-gray-900 text-xs' bold>
        {pos.name}
        <DuplicateOutlineIcon
          className='stroke-current text-yellow-500 w-4 h-4 float-right cursor-pointer'
          onClick={() => toClipboard(`PDV: ${pos.name} - ${pos.address.fullAddress}`)}
        />
      </Typography>
      <Typography variant='p' className='text-gray-900 leading-tight text-[0.6rem]'>
        {pos.address.fullAddress}
      </Typography>
    </Map.Marker>
  );

  return (
    <Layout>
      <Layout.Header
        leftComponent={
          <div className={`relative w-36 h-full shadow rounded`}>
            <Image
              src={company.image || '/images/logo.png'}
              layout='fill'
              objectFit='contain'
              objectPosition='center'
              alt='logo'
              className='rounded'
            />
            <label className={editIconClasses} htmlFor='imageUploadButton'>
              <PencilSolidIcon className='w-4 h-4' />
            </label>
            <input type='file' id='imageUploadButton' style={{ display: 'none' }} onChange={handleImageChange} />
            {loading && (
              <div className='absolute mx-auto my-auto'>
                <LoadingAnimation size='2xs' />
              </div>
            )}
          </div>
        }
        breadcrumb={{ main: { title: company.name, subtitle: company.CNPJ }, list: [{ title: 'Clientes', href: '/customers' }] }}
      >
        <div className='flex flex-row w-full mt-4'>
          <div className='flex flex-row rounded shadow'>
            <div
              onClick={() => setCurrentView('Projetos')}
              className={`${currentView === 'Projetos' ? 'bg-yellow-300' : 'bg-yellow-100'}
              px-4 py-3 rounded-l cursor-pointer transition-colors`}
            >
              Projetos
            </div>
            <div
              onClick={() => setCurrentView('Pontos de Venda')}
              className={`${currentView === 'Pontos de Venda' ? 'bg-yellow-300' : 'bg-yellow-100'} 
              px-4 py-3 rounded-r cursor-pointer transition-colors`}
            >
              Pontos de Venda
            </div>
          </div>
        </div>
      </Layout.Header>
      {currentView === 'Pontos de Venda' ? (
        <Layout.FABRow
          buttons={[
            {
              tooltipContent: 'Adicionar PDV',
              button: (
                <Button primary rounded href={`/customers/pos/new?company=${query['id']}`}>
                  <span className='flex flex-row justify-around'>
                    <SumOutlineIcon className={iconClasses} />
                  </span>
                </Button>
              ),
            },
          ]}
        />
      ) : (
        <Layout.FABRow
          buttons={[
            {
              tooltipContent: 'Adicionar Projeto',
              button: (
                <Button primary rounded href={`/projects/new?company=${query['id']}`}>
                  <span className='flex flex-row justify-around'>
                    <SumOutlineIcon className={iconClasses} />
                  </span>
                </Button>
              ),
            },
          ]}
        />
      )}
      <Layout.Content>
        {(!posData || !projectsData) && <LoadingAnimation />}
        {currentView === 'Pontos de Venda' && posData && (
          <>
            {!posData.length ? (
              <Typography variant='h6' muted className='tracking-wide text-center'>
                Nenhum PDV Encontrado
              </Typography>
            ) : (
              <>
                <ul className='overflow-y-scroll list-none h-[200px] px-3'>
                  {posData.map((pos) => {
                    return (
                      <li
                        key={pos.id}
                        className={`group rounded p-5 my-5 w-full transition-colors bg-white dark:bg-gray-700 cursor-pointer select-none
                      hover:bg-yellow-100 dark:hover:bg-yellow-200 shadow appearance-none
                      ${
                        parseFloat(pos.address.lat) == mapFocus.latitude &&
                        parseFloat(pos.address.lng) == mapFocus.longitude &&
                        'bg-yellow-500 dark:bg-yellow-500'
                      }`}
                        onClick={() => focusMapOn(pos)}
                      >
                        <Typography variant='span' className='group-hover:text-gray-900' bold>
                          {pos.name}
                        </Typography>
                      </li>
                    );
                  })}
                </ul>
                <div className='w-full h-[330px] mt-5 shadow'>
                  <Map latitude={mapFocus.latitude} longitude={mapFocus.longitude} zoom={mapFocus.zoom} geolocateControl>
                    {posData &&
                      posData.length &&
                      posData.map((pos) => {
                        if (pos.address) {
                          return (
                            <POSMarker
                              key={pos.id}
                              pos={pos}
                              active={
                                parseFloat(pos.address.lat) == mapFocus.latitude &&
                                parseFloat(pos.address.lng) == mapFocus.longitude
                              }
                            />
                          );
                        }
                      })}
                  </Map>
                </div>
              </>
            )}
          </>
        )}
        {currentView === 'Projetos' && projectsData && (
          <>
            {!projectsData.length ? (
              <Typography variant='h6' muted className='tracking-wide text-center'>
                Nenhum Projeto Encontrado
              </Typography>
            ) : (
              <ul className='overflow-y-scroll list-none h-[500px]'>
                {projectsData.map((project) => {
                  return (
                    <Link key={project.id} href={`/projects/${Buffer.from(project.id).toString('base64')}`}>
                      <li
                        className={`group p-5 my-5 w-full bg-white dark:bg-gray-700 transition-colors 
                        hover:bg-yellow-500 dark:hover:bg-yellow-500 rounded shadow-lg cursor-pointer active:shadow-none select-none
                        flex flex-row justify-between`}
                      >
                        <Typography variant='span' className='group-hover:text-white' bold>
                          {project.name}
                        </Typography>
                        <Typography variant='span' className='group-hover:text-white' muted>
                          {project.contract}
                        </Typography>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default withAuthenticationRequired(Customer);
