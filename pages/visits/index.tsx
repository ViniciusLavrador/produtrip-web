import { withAuthenticationRequired } from '@auth0/auth0-react';
import { DatePicker, LoadingAnimation, Typography } from 'components';
import { useApi, useThemeMode } from 'hooks';
import { useRouter } from 'next/router';
import { CheckOutlineIcon, DuplicateOutlineIcon, SumOutlineIcon } from 'public/icons/outline';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from 'components/Layout/Layout';
import { Map } from 'components/Map';
import cx from 'classnames';
import { Menu, Item, useContextMenu, TriggerEvent } from 'react-contexify';
import { AnimatePresence, motion } from 'framer-motion';

// -- POS List
// --- POS Element Context Menu
export interface POSElementContextMenuProps {
  pos: any;
  setNewVisitPOS: React.Dispatch<any>;
}

export const POSElementContextMenu = ({ pos, setNewVisitPOS }: POSElementContextMenuProps) => {
  const { currentMode } = useThemeMode();

  const iconClasses = cx('ml-4', 'w-4 h-4');
  const itemContainerClasses = cx('flex flex-row', 'justify-between items-center', 'w-full');

  return (
    <Menu id={pos.id} theme={currentMode}>
      <Item>
        <div className={itemContainerClasses} onClick={() => setNewVisitPOS(pos)}>
          Adicionar Visita
          <SumOutlineIcon className={iconClasses} />
        </div>
      </Item>
    </Menu>
  );
};

export interface POSListProps {
  totalPOSList: any[];
  selectedPOS: any[];
  setSelectedPOS: any;
  setNewVisitPOS: React.Dispatch<any>;
}

export const POSList = ({ totalPOSList, selectedPOS, setSelectedPOS, setNewVisitPOS }: POSListProps) => {
  const { show } = useContextMenu();

  const selectPOS = (selection: any) => {
    let newSelection = selectedPOS.filter((p) => p.id != selection.id);
    if (newSelection.length === selectedPOS.length) {
      newSelection.push(selection);
    }

    setSelectedPOS(newSelection);
  };

  return (
    <div className='w-full p-5 max-h-[400px] overflow-y-scroll'>
      {totalPOSList.map((pos) => {
        let isActive = selectedPOS.map((p) => p.id).includes(pos.id);

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
              <Typography variant='p' className='text-black text-xs' bold>
                {pos.name}
              </Typography>
            </div>
            <POSElementContextMenu pos={pos} setNewVisitPOS={setNewVisitPOS} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

// -- Users List
export interface UsersListProps {
  totalUserList: any[];
  selectedUsers: any[];
  setSelectedUsers: any;
}

export const UsersList = ({ totalUserList, selectedUsers, setSelectedUsers }: UsersListProps) => {
  const selectUser = (selection: any) => {
    let newSelection = selectedUsers.filter((u) => u.user_id != selection.user_id);
    if (newSelection.length === selectedUsers.length) {
      newSelection.push(selection);
    }
    setSelectedUsers(newSelection);
  };

  return (
    <div className='w-full p-5 max-h-[400px] overflow-y-scroll'>
      {totalUserList.map((user) => {
        let isActive = selectedUsers.map((u) => u.user_id).includes(user.user_id);
        return (
          <div
            className={`${
              isActive
                ? 'bg-yellow-300 hover:bg-yellow-200'
                : 'bg-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-500'
            } p-3 rounded cursor-pointer select-none text-center my-2`}
            key={user.user_id}
            onClick={() => selectUser(user)}
          >
            <Typography variant='p' className='text-black text-xs' bold>
              {user.name}
            </Typography>
          </div>
        );
      })}
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

// -- New Visit Modal
export interface NewVisitModalProps {
  pos?: any;
  setNewVisitPOS: React.Dispatch<any>;
}

export const NewVisitModal = ({ pos, setNewVisitPOS }: NewVisitModalProps) => {
  // Set Listener to Close Modal on ESC
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setNewVisitPOS(undefined);
      }
    };

    window.addEventListener('keydown', close);

    return () => window.removeEventListener('keydown', close);
  }, []);

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          {/*content*/}
          <motion.div
            initial='closed'
            animate='open'
            exit='closed'
            variants={{ open: { opacity: 1, scale: 1 }, closed: { opacity: 0, scale: 0 } }}
            className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'
          >
            {/*header*/}
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              {pos && <h3 className='text-3xl font-semibold'>Nova Visita em {pos.name}</h3>}
            </div>
            {/*body*/}
            <div className='relative p-6 flex-auto'>
              <p className='my-4 text-gray-900 text-lg leading-relaxed'>CREATE NEW VISIT FORM</p>
            </div>
            {/*footer*/}
            <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
              <button
                className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => setNewVisitPOS(undefined)}
              >
                Close
              </button>
              <button
                className='bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => setNewVisitPOS(undefined)}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  );
};

// -- Visits Page
export interface VisitsProps {}

export const Visits = ({}: VisitsProps) => {
  const { query } = useRouter();
  let projectID = query['projectID'] ? Buffer.from(query['projectID'] as string, 'base64').toString() : undefined;

  const [mapFocus, setMapFocus] = useState<{ latitude: number; longitude: number; zoom?: number }>({
    latitude: -14.2401,
    longitude: -53.1805,
    zoom: 3,
  });

  const [visitDate, setVisitDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const [selectedPOS, setSelectedPOS] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newVisitPOS, setNewVisitPOS] = useState<any | undefined>();

  const {
    data: projectData,
    error: projectError,
    isLoading: projectLoading,
  } = useApi(`projects/${projectID}?r=company&r=pos&r=visits&r=visits.pos`);

  const { data: userData, error: userError, isLoading: userLoading } = useApi(`auth/users`);

  if (!projectData || projectLoading || !userData || userLoading) {
    return <LoadingAnimation />;
  }

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: 'Visitas' },
          list: [
            { title: projectData.company.name, href: `/customers/${Buffer.from(projectData.company.id).toString('base64')}` },
            { title: projectData.name, href: `/projects/${Buffer.from(projectData.id).toString('base64')}` },
          ],
        }}
      />
      <Layout.Content>
        <div className='flex flex-row gap-5'>
          <div className='w-1/5 bg-white dark:bg-gray-800 rounded flex flex-col items-center'>
            <DatePicker
              selected={visitDate}
              onChange={(date) => setVisitDate(date as Date)}
              className='mt-5'
              label='Data da Visita'
            />

            <Typography variant='h6' className='mt-5 select-none' bold>
              Pontos de Venda
            </Typography>
            {projectData && projectData.pos && (
              <POSList
                totalPOSList={projectData.pos}
                selectedPOS={selectedPOS}
                setSelectedPOS={setSelectedPOS}
                setNewVisitPOS={setNewVisitPOS}
              />
            )}
          </div>
          <div className='h-[550px] w-3/5 rounded shadow'>
            <Map latitude={mapFocus.latitude} longitude={mapFocus.longitude} zoom={mapFocus.zoom}>
              {projectData &&
                projectData.pos &&
                projectData.pos.length &&
                projectData.pos.map(
                  (pos: any) =>
                    pos.address && (
                      <POSMarker
                        key={pos.id}
                        pos={pos}
                        active={
                          parseFloat(pos.address.lat) == mapFocus.latitude && parseFloat(pos.address.lng) == mapFocus.longitude
                        }
                      />
                    )
                )}
            </Map>
          </div>
          <div className='w-1/5 bg-white dark:bg-gray-800 rounded flex flex-col items-center'>
            <Typography variant='h6' className='mt-5 select-none' bold>
              Colaboradores
            </Typography>
            {userData && <UsersList totalUserList={userData} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />}
          </div>
        </div>
        <AnimatePresence>{newVisitPOS && <NewVisitModal pos={newVisitPOS} setNewVisitPOS={setNewVisitPOS} />}</AnimatePresence>
      </Layout.Content>
    </Layout>
  );
};

export default withAuthenticationRequired(Visits);
