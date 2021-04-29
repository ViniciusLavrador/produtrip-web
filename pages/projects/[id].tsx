import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Button, LoadingAnimation, Typography } from 'components';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { AnimatePresence, motion } from 'framer-motion';
import { useApi } from 'hooks';
import { useRouter } from 'next/router';
import { ChevronDownOutlineIcon, ChevronUpOutlineIcon } from 'public/icons/outline';
import { useState } from 'react';
import { toast } from 'react-toastify';
import cx from 'classnames';
import useOnclickOutside from 'react-cool-onclickoutside';
import axios from 'axios';

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
          data: { pos: toRemove },
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

export interface ProjectProps {}

export const Project = ({}: ProjectProps) => {
  const { query } = useRouter();
  let id = Buffer.from(query['id'] as string, 'base64').toString();

  const { data: projectsData, error: projectsError, isLoading: projectsLoading } = useApi(`projects/${id}`);
  const { data: posData, error: posError, isLoading: posLoading } = useApi(
    projectsData && `companies/${projectsData.company.id}/pos`
  );

  if (!projectsData || projectsLoading || projectsError) {
    if (projectsError) {
      toast.error(projectsError);
    }

    return <LoadingAnimation size='2xl' />;
  }

  if (!posData || posLoading || posError) {
    if (posError) {
      toast.error(posError);
    }

    return <LoadingAnimation size='2xl' />;
  }

  const project = projectsData;
  const POS = posData;

  console.log(project);

  return (
    <div className='h-full w-full'>
      <div className='w-full mb-5'>
        <Breadcrumbs>
          <Breadcrumbs.ListItem
            title={project.company.name}
            href={`/customers/${Buffer.from(project.company.id).toString('base64')}`}
          />
          <Breadcrumbs.MainItem title={project.name} subtitle={project.contract} />
        </Breadcrumbs>
      </div>
      <div className='w-full'>
        <POSList totalPOSData={POS} previouslySelectedPOSData={[]} projectID={id} /> {/* fix previsoulySelectedPOSData */}
      </div>
    </div>
  );
};

export default withAuthenticationRequired(Project);
