import { useRouter } from 'next/router';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { useApi } from 'hooks';
import { Button, LoadingAnimation, Tooltip, Typography } from 'components';
import { DuplicateSolidIcon } from 'public/icons/solid';
import { toast } from 'react-toastify';

import cx from 'classnames';

import { DuplicateOutlineIcon, SumOutlineIcon } from 'public/icons/outline';
import { Map } from 'components/Map';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export interface CustomerProps {}

export const Customer = ({}: CustomerProps) => {
  const [mapFocus, setMapFocus] = useState<{ latitude: number; longitude: number; zoom?: number }>({
    latitude: -14.2401,
    longitude: -53.1805,
    zoom: 3,
  });

  const FABRowClasses = cx('fixed bottom-10 right-10 flex flex-row gap-5');
  const iconClasses = cx('h-6 w-6');

  const { query } = useRouter();

  let id = Buffer.from(query['id'] as string, 'base64').toString();
  let { data: companyData, isLoading: companyLoading, error: companyError } = useApi(`companies/${id}`);
  let { data: projectsData, isLoading: projectsLoading, error: projectsError } = useApi(`companies/${id}/projects`);
  let { data: posData, isLoading: posLoading, error: posError, revalidate } = useApi(`companies/${id}/pos`);

  if (companyError) {
    toast.error(companyError);
    return <LoadingAnimation size='2xl' />;
  }

  if (companyLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  const company = companyData;

  const toClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('✔️ Copiado com sucesso !');
  };

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

  const ProjectsList = ({ projects }: { projects?: any[] }) => {
    return (
      <ul className='h-[500px] bg-gray-50 dark:bg-gray-800 rounded shadow p-5'>
        <Typography variant='h4' className='mb-5 tracking-wide text-center'>
          Projetos
        </Typography>
        {projects ? (
          !projects.length ? (
            <Typography variant='h6' muted className='tracking-wide text-center'>
              Nenhum Projeto Encontrado
            </Typography>
          ) : (
            projects.map((project) => {
              return (
                <Link key={project.id} href={`/projects/${Buffer.from(project.id).toString('base64')}`}>
                  <li className='group p-5 my-5 w-full bg-white dark:bg-gray-700 transition-colors hover:bg-yellow-500 dark:hover:bg-yellow-500 rounded shadow-lg cursor-pointer active:shadow-none select-none'>
                    <Typography variant='span' className='group-hover:text-white' bold>
                      {project.contract} — {project.name}
                    </Typography>
                  </li>
                </Link>
              );
            })
          )
        ) : (
          <LoadingAnimation size='2xs' />
        )}
      </ul>
    );
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='w-full'>
          <Typography variant='h2' className='cols-span-2'>
            {company.name}
          </Typography>
          <Typography variant='span' bold muted className='ml-1'>
            {company.CNPJ}
          </Typography>
        </div>
        <br />
        <div className='grid grid-cols-4 gap-5 h-[500px]'>
          <div className='col-span-1'>{projectsData && <ProjectsList projects={projectsData} />}</div>

          <div className='col-span-1'>
            <ul className='h-[500px] overflow-scroll bg-gray-50 dark:bg-gray-800 rounded shadow p-5'>
              <Typography variant='h4' className='mb-5 tracking-wide text-center'>
                PDVs
              </Typography>

              {posData ? (
                !posData.length ? (
                  <Typography variant='h6' muted className='tracking-wide text-center'>
                    Nenhum PDV Encontrado
                  </Typography>
                ) : (
                  posData.map((pos) => {
                    return (
                      <li
                        key={pos.id}
                        className={cx(
                          'group',
                          'p-5 my-5',
                          'w-full',
                          'transition-colors',
                          'bg-white dark:bg-gray-700',
                          {
                            'bg-yellow-500 dark:bg-yellow-500':
                              parseFloat(pos.address.lat) == mapFocus.latitude &&
                              parseFloat(pos.address.lng) == mapFocus.longitude,
                          },
                          'hover:bg-yellow-500 dark:hover:bg-yellow-500',
                          'rounded',
                          'shadow-lg active:shadow-none',
                          'cursor-pointer',
                          'select-none'
                        )}
                        onClick={() => {
                          if (pos.address) {
                            setMapFocus({
                              latitude: parseFloat(pos.address.lat),
                              longitude: parseFloat(pos.address.lng),
                              zoom: 13,
                            });
                          }
                        }}
                      >
                        <Typography variant='span' className='group-hover:text-white' bold>
                          {pos.name}
                        </Typography>
                      </li>
                    );
                  })
                )
              ) : (
                <LoadingAnimation size='2xs' />
              )}
            </ul>
          </div>

          <div className='col-span-full md:col-span-2  '>
            <div className='w-full h-full shadow '>
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
                            parseFloat(pos.address.lat) == mapFocus.latitude && parseFloat(pos.address.lng) == mapFocus.longitude
                          }
                        />
                      );
                    }
                  })}
              </Map>
            </div>
          </div>
        </div>
      </div>

      <div className={FABRowClasses}>
        <Tooltip content='Adicionar Projeto' placement='top'>
          <Button primary href={`/projects/new?company=${query['id']}`}>
            <span className='flex flex-row justify-around'>
              <SumOutlineIcon className={iconClasses} /> Projeto
            </span>
          </Button>
        </Tooltip>
        <Tooltip content='Adicionar PDV' placement='top'>
          <Button primary href={`/customers/pos/new?company=${query['id']}`}>
            <span className='flex flex-row justify-around'>
              <SumOutlineIcon className={iconClasses} /> PDV
            </span>
          </Button>
        </Tooltip>
      </div>
    </>
  );
};

export default withAuthenticationRequired(Customer);
