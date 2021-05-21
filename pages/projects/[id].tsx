import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Button, FormField, LoadingAnimation, Tooltip, Typography } from 'components';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { AnimatePresence, motion } from 'framer-motion';
import { useApi } from 'hooks';
import { useRouter } from 'next/router';
import { ChevronDownOutlineIcon, ChevronUpOutlineIcon, DuplicateOutlineIcon, SumOutlineIcon } from 'public/icons/outline';
import { useState } from 'react';
import { toast } from 'react-toastify';
import cx from 'classnames';
import useOnclickOutside from 'react-cool-onclickoutside';
import axios from 'axios';
import Layout from 'components/Layout/Layout';
import { Map } from 'components/Map';

interface POSListProps {
  totalPOSData: any[];
  previouslySelectedPOSData: any[];
  projectID: string;
}

const POSList = ({ previouslySelectedPOSData, totalPOSData, projectID }: POSListProps) => {
  if (!totalPOSData || !previouslySelectedPOSData) {
    return <LoadingAnimation size='md' />;
  }

  const initialSelection = previouslySelectedPOSData.length ? previouslySelectedPOSData.map((selected) => selected.id) : [];

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(initialSelection);

  const { getAccessTokenSilently } = useAuth0();

  const onClickOutsideRef = useOnclickOutside(() => {
    setOpen(false);
  });

  const toggleAll = () => {
    if (selected.length !== totalPOSData.length) {
      setSelected(totalPOSData.map((pos) => pos.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s != id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    let accessToken = await getAccessTokenSilently();

    let toRemove = initialSelection.filter((s) => !selected.includes(s));
    let toAdd = selected.filter((s) => !initialSelection.includes(s));

    if (toRemove.length) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/projects/${projectID}/pos`, {
          headers: { Authentication: `Bearer ${accessToken}` },
          data: { pos: toRemove },
        });
      } catch (err) {
        toast.error('Falha ao Remover PDV', { toastId: 'projects/id/removePOS' });
        console.error(err);
      }
    }

    if (toAdd.length) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/projects/${projectID}/pos`, {
          headers: { Authentication: `Bearer ${accessToken}` },
          data: { pos: toAdd },
        });
      } catch (err) {
        toast.error('Falha ao Adicionar PDV', { toastId: 'projects/id/addPOS' });
        console.error(err);
      }
    }

    setLoading(false);
  };

  return (
    <div className='bg-white dark:bg-gray-800 p-3 rounded' ref={onClickOutsideRef}>
      <div className='w-full py-2 flex flex-row justify-between cursor-pointer' onClick={() => setOpen(!open)}>
        <Typography variant='span' bold>
          Pontos de Venda
        </Typography>
        {!open && <ChevronDownOutlineIcon className='h-6 w-6 stroke-current text-black dark:text-white' />}
        {open && <ChevronUpOutlineIcon className='h-6 w-6 stroke-current text-black dark:text-white' />}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial='closed'
            animate='open'
            exit='closed'
            variants={{
              open: {
                opacity: 1,
                height: 'auto',
                transition: { staggerChildren: 0.1, duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] },
              },
              closed: {
                opacity: 0,
                height: 0,
                transition: { staggerChildren: 0.1, staggerDirection: -1, when: 'afterChildren', duration: 0.8 },
              },
            }}
          >
            <motion.div
              className='w-full p-3 grid grid-cols-3 gap-5'
              initial='closed'
              animate='open'
              exit='closed'
              variants={{ open: { scale: 1, opacity: 1 }, closed: { scale: 0, opacity: 0 } }}
              transition={{ duration: 0.5 }}
            >
              <div className='col-span-1'>
                <label className='flex justify-start items-start cursor-pointer w-max'>
                  <div className='bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-yellow-500'>
                    <input
                      type='checkbox'
                      value='select-all'
                      className='opacity-0 absolute'
                      checked={selected.length === totalPOSData.length}
                      onChange={toggleAll}
                    />
                    <svg className='fill-current hidden w-4 h-4 text-yellow-500 pointer-events-none' viewBox='0 0 20 20'>
                      <path d='M0 11l2-2 5 5L18 3l2 2L7 18z' />
                    </svg>
                  </div>
                  <Typography
                    variant='span'
                    className={'select-none break-all'}
                    light={!(selected.length === totalPOSData.length) || undefined}
                    muted={!(selected.length === totalPOSData.length) || undefined}
                  >
                    {selected.length !== totalPOSData.length ? 'Selecionar Todos' : 'Remover Seleção'}
                  </Typography>
                </label>
              </div>

              {totalPOSData.map((pos) => {
                let isSelected = selected.includes(pos.id);
                return (
                  <div className='col-span-1' key={pos.id}>
                    <label className='flex justify-start items-start cursor-pointer w-max'>
                      <div className='bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-yellow-500'>
                        <input
                          type='checkbox'
                          value={pos.id}
                          className='opacity-0 absolute'
                          checked={isSelected}
                          onChange={(e) => toggleSelection(e.target.value)}
                        />
                        <svg className='fill-current hidden w-4 h-4 text-yellow-500 pointer-events-none' viewBox='0 0 20 20'>
                          <path d='M0 11l2-2 5 5L18 3l2 2L7 18z' />
                        </svg>
                      </div>
                      <Typography
                        variant='span'
                        className={'select-none break-all'}
                        light={!isSelected || undefined}
                        muted={!isSelected || undefined}
                      >
                        {pos.name}
                      </Typography>
                    </label>
                  </div>
                );
              })}

              <div className='col-span-full '>
                <Button label='Confirmar' primary className='float-right block w-full' onClick={handleSave} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// -------
// Fix Types
export interface SideBarProps {
  open: boolean;
  setOpen: any;
  totalPosList: any[];
  initialSelection: any[];
}

export const POSSideBar = ({ open, setOpen, totalPosList }: SideBarProps) => {
  const rootClasses = cx('w-full bg-white dark:bg-gray-800 rounded p-5', { 'h-full': open }, { 'h-auto': !open });
  return (
    <div className={rootClasses}>
      <div onClick={() => (open ? setOpen(undefined) : setOpen('posList'))}>
        <Typography variant='h4' className='text-center cursor-pointer select-none'>
          Pontos de Venda
        </Typography>
      </div>
      {open && (
        <motion.div
          initial='closed'
          animate='open'
          exit='closed'
          variants={{
            open: {
              opacity: 1,
              height: 'auto',
            },
            closed: {
              opacity: 0,
              height: 0,
            },
          }}
        >
          <div className='py-3 max-h-[300px] overflow-y-scroll'>
            {totalPosList.map((pos) => {
              return (
                <label htmlFor={pos.id} className='flex flex-row items-center py-2 px-3' key={pos.id}>
                  <input type='checkbox' name={pos.id} className='mr-5 transform-gpu scale-125' />
                  <Typography variant='p' className='clear-both'>
                    {pos.name}
                  </Typography>
                </label>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// -- Visits
export const VisitsSideBar = ({ open, setOpen, totalPosList }: SideBarProps) => {
  const rootClasses = cx('w-full bg-white dark:bg-gray-800 rounded p-5', { 'h-full': open }, { 'h-auto': !open });
  return (
    <div className={rootClasses}>
      <div onClick={() => (open ? setOpen(undefined) : setOpen('visitsList'))}>
        <Typography variant='h4' className='text-center cursor-pointer select-none'>
          Visitas Agendadas
        </Typography>
      </div>
      {open && (
        <motion.div
          initial='closed'
          animate='open'
          exit='closed'
          variants={{
            open: {
              opacity: 1,
              height: 'auto',
            },
            closed: {
              opacity: 0,
              height: 0,
            },
          }}
        >
          <div className='py-3 max-h-[300px] overflow-y-scroll'>
            {totalPosList.map((pos) => {
              return (
                <label htmlFor={pos.id} className='flex flex-row items-center py-2 px-3' key={pos.id}>
                  <input type='checkbox' name={pos.id} className='mr-5 transform-gpu scale-125' />
                  <Typography variant='p' className='clear-both'>
                    {pos.name}
                  </Typography>
                </label>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// -- POS Marker
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

export interface ProjectProps {}

export const Project = ({}: ProjectProps) => {
  const [open, setOpen] = useState<'posList' | 'visitsList' | undefined>();

  const [mapFocus, setMapFocus] = useState<{ latitude: number; longitude: number; zoom?: number }>({
    latitude: -14.2401,
    longitude: -53.1805,
    zoom: 3,
  });

  const { query } = useRouter();
  let id = Buffer.from(query['id'] as string, 'base64').toString();

  const { data: projectData, error: projectError, isLoading: projectLoading } = useApi(`projects/${id}?r=company&r=pos`);

  const {
    data: totalPosData,
    error: totalPosError,
    isLoading: totalPosLoading,
  } = useApi(projectData && `companies/${projectData.company.id}/pos`);

  if (!projectData || projectLoading || projectError) {
    if (projectError) {
      toast.error(projectError);
    }

    return <LoadingAnimation size='2xl' />;
  }

  if (!totalPosData || totalPosLoading || totalPosError) {
    if (totalPosError) {
      toast.error(totalPosError);
    }

    return <LoadingAnimation size='2xl' />;
  }

  const FABRowClasses = cx('fixed bottom-10 right-10 flex flex-row gap-5 z-10');

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: projectData.name, subtitle: projectData.contract },
          list: [
            { title: projectData.company.name, href: `/customers/${Buffer.from(projectData.company.id).toString('base64')}` },
          ],
        }}
      />
      <Layout.Content>
        {/* <POSList totalPOSData={totalPosData} previouslySelectedPOSData={projectData.pos} projectID={id} /> */}
        <div className='flex flex-row'>
          <div className='w-1/3 flex flex-col gap-3'>
            <POSSideBar
              open={open == 'posList'}
              setOpen={setOpen}
              totalPosList={totalPosData}
              initialSelection={projectData.pos}
            />
            <VisitsSideBar
              open={open == 'visitsList'}
              setOpen={setOpen}
              totalPosList={totalPosData}
              initialSelection={projectData.pos}
            />
          </div>
          <div className='h-[550px] ml-5 w-full rounded shadow'>
            <Map latitude={mapFocus.latitude} longitude={mapFocus.longitude} zoom={mapFocus.zoom} geolocateControl>
              {projectData &&
                projectData.pos &&
                projectData.pos.length &&
                projectData.pos.map((pos) => {
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

        <div className={FABRowClasses}>
          <Tooltip content='Visitas do Projeto' placement='top'>
            <Button primary href={`/visits?projectID=${query['id']}`}>
              <span className='flex flex-row justify-around'>Visitas</span>
            </Button>
          </Tooltip>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default withAuthenticationRequired(Project);
