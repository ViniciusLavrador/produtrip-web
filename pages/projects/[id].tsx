import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Button, FormField, LoadingAnimation, Tooltip, Typography } from 'components';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { AnimatePresence, motion } from 'framer-motion';
import { useApi } from 'hooks';
import { useRouter } from 'next/router';
import {
  CheckOutlineIcon,
  ChevronDownOutlineIcon,
  ChevronUpOutlineIcon,
  DuplicateOutlineIcon,
  SumOutlineIcon,
} from 'public/icons/outline';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import cx from 'classnames';
import useOnclickOutside from 'react-cool-onclickoutside';
import axios from 'axios';
import Layout from 'components/Layout/Layout';
import { Map } from 'components/Map';
import { TriggerEvent, useContextMenu } from 'react-contexify';
import React from 'react';

// -------
// Fix Types
export interface POSListProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<'posList' | 'visitsList'>>;
  totalPOSList: any[];
  selectedPOS: any[];
  setSelectedPOS: any;
  initialSelectedPOS: any[];
  projectID: string;
  revalidate: any;
}

export const POSList = ({ open, setOpen, totalPOSList, initialSelectedPOS, projectID, revalidate }: POSListProps) => {
  const { show } = useContextMenu();
  const [selected, setSelected] = useState(initialSelectedPOS);
  const { getAccessTokenSilently } = useAuth0();

  const selectPOS = (selection: any) => {
    let newSelection = selected.filter((p) => p.id != selection.id);
    if (newSelection.length === selected.length) {
      newSelection.push(selection);
    }

    setSelected(newSelection);
  };

  const saveSelection = async () => {
    let toRemove = initialSelectedPOS.filter((s) => !selected.includes(s));
    let toAdd = selected.filter((s) => !initialSelectedPOS.includes(s));

    let success = true;

    let accessToken = await getAccessTokenSilently();

    if (toAdd && toAdd.length > 0 && success) {
      try {
        console.log('adding', toAdd);
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/projects/${projectID}/pos`,
          { pos: toAdd.map((s) => s.id) },
          {
            headers: { Authentication: `Bearer ${accessToken}` },
          }
        );
      } catch (err) {
        toast.error(err);
        success = false;
      }
    }

    if (toRemove && toRemove.length > 0 && success) {
      try {
        console.log('removing', toRemove);
        await axios.delete(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/projects/${projectID}/pos`, {
          headers: { Authentication: `Bearer ${accessToken}` },
          data: { pos: toRemove.map((s) => s.id) },
        });
      } catch (err) {
        toast.error(err);
        success = false;
      }
    }

    if (success) {
      toast.success("Sucesso ao Alterar os PDV's ✔");
      revalidate();
    }
  };

  const rootClasses = cx(
    'w-full bg-white dark:bg-gray-800 rounded p-5 shadow cursor-pointer',
    { 'h-max': open },
    { 'h-auto': !open }
  );
  return (
    <div className={rootClasses} onClick={() => (open ? setOpen(undefined) : setOpen('posList'))}>
      <div className='flex flex-row justify-around items-center mb-5 first:pt-0'>
        <Typography variant='h4' className='text-center select-none'>
          Pontos de Venda
        </Typography>
        {open && (
          <button
            onClick={saveSelection}
            className='bg-yellow-300 hover:bg-yellow-500 rounded-full w-8 h-8 flex flex-row items-center justify-center'
          >
            <CheckOutlineIcon className='h-4 w-4' />
          </button>
        )}
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
          <div className='pb-3 pt-5 max-h-[300px] overflow-y-scroll'>
            {totalPOSList.map((pos) => {
              let isActive = selected.map((p) => p.id).includes(pos.id);

              let displayContextMenu = (e: TriggerEvent) => {
                e.stopPropagation();
                show(e, { id: pos.id, props: { id: pos.id } });
              };

              return (
                <React.Fragment key={pos.id}>
                  <div
                    onContextMenu={(e) => displayContextMenu(e)}
                    className={`${
                      isActive
                        ? 'bg-yellow-300 hover:bg-yellow-200'
                        : 'bg-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-500'
                    } p-3 rounded cursor-pointer select-none text-center my-2`}
                    onClick={() => selectPOS(pos)}
                  >
                    <Typography variant='p' className='text-black dark:text-white text-xs' bold>
                      {pos.name}
                    </Typography>
                  </div>
                </React.Fragment>
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
  const [selectedPOS, setSelectedPOS] = useState<string[]>([]);

  const [mapFocus, setMapFocus] = useState<{ latitude: number; longitude: number; zoom?: number }>({
    latitude: -14.2401,
    longitude: -53.1805,
    zoom: 3,
  });

  const { query } = useRouter();
  let id = Buffer.from(query['id'] as string, 'base64').toString();

  const {
    data: projectData,
    error: projectError,
    isLoading: projectLoading,
    revalidate,
  } = useApi(`projects/${id}?r=company&r=pos`);
  const {
    data: companyPOSData,
    error: companyPOSError,
    isLoading: companyPOSLoading,
  } = useApi(projectData && projectData.company.id && `companies/${projectData.company.id}/pos`);

  if (!projectData || projectLoading || projectError || !companyPOSData || companyPOSError || companyPOSLoading) {
    if (projectError) {
      toast.error(projectError);
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
        <div className='flex flex-row'>
          <div className='w-1/3 flex flex-col gap-3'>
            <POSList
              open={open == 'posList'}
              setOpen={setOpen}
              totalPOSList={companyPOSData}
              selectedPOS={selectedPOS}
              setSelectedPOS={setSelectedPOS}
              initialSelectedPOS={projectData.pos}
              projectID={projectData.id}
              revalidate={revalidate}
            />
            {/* <VisitsSideBar
              open={open == 'visitsList'}
              setOpen={setOpen}
              totalPosList={companyPOSData}
              selected={selectedPOS}
              setSelected={setSelectedPOS}
            /> */}
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
            <Button primary href={`/visits?projectID=${query['id']}`} disabled>
              <span className='flex flex-row justify-around'>Visitas</span>
            </Button>
          </Tooltip>
          <Tooltip content='Formulários' placement='top'>
            <Button primary href={`/forms?projectID=${query['id']}`}>
              <span className='flex flex-row justify-around'>Formulários</span>
            </Button>
          </Tooltip>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default withAuthenticationRequired(Project);
