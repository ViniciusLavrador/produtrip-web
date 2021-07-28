import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { DatePicker, LoadingAnimation, Typography } from 'components';
import { useApi, useThemeMode } from 'hooks';
import { useRouter } from 'next/router';
import { CheckOutlineIcon, DuplicateOutlineIcon, SumOutlineIcon, XOutlineIcon } from 'public/icons/outline';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from 'components/Layout/Layout';
import { Map } from 'components/Map';
import cx from 'classnames';
import { Menu, Item, useContextMenu, TriggerEvent } from 'react-contexify';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDatePicker from 'react-datepicker';
import { addMinutes } from 'date-fns';
import axios from 'axios';
import { Layer, Source } from 'react-map-gl';
import { decode, toGeoJSON } from '@mapbox/polyline';

const VISIT_DURATION_BLOCK = 15;

// -- POS List
// --- POS Element Context Menu
interface POSElementContextMenuProps {
  pos: any;
  setNewVisitPOS: React.Dispatch<any>;
}

const POSElementContextMenu = ({ pos, setNewVisitPOS }: POSElementContextMenuProps) => {
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

interface VisitMarkerContextMenuProps {
  visit: any;
  revalidate: any;
}

const VisitMarkerContextMenu = ({ visit, revalidate }: VisitMarkerContextMenuProps) => {
  const { currentMode } = useThemeMode();
  const { getAccessTokenSilently } = useAuth0();

  const iconClasses = cx('ml-4', 'w-4 h-4');
  const itemContainerClasses = cx('flex flex-row', 'justify-between items-center', 'w-full');

  const removeVisit = async () => {
    try {
      let accessToken = await getAccessTokenSilently();
      await axios.delete(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/pos/${visit.pos.id}/visits/${visit.id}`, {
        headers: { Authentication: `Bearer ${accessToken}` },
      });
      toast.success('Visita Removida com Sucesso !', { toastId: 'VisitRemovalSuccess' });
      revalidate();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao Remover Visita.', { toastId: 'VisitRemovalError' });
    }
  };

  return (
    <Menu id={visit.id} theme={currentMode}>
      <Item>
        <div className={itemContainerClasses} onClick={removeVisit}>
          Remover Visita
          <XOutlineIcon className={iconClasses} />
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
              <Typography variant='p' className='text-black dark:text-white text-xs' bold>
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
            <Typography variant='p' className='text-black dark:text-white text-xs' bold>
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
  toast.success('✔️ Copiado com sucesso !', { toastId: 'successCopy' });
};

const POSMarker = ({ pos, active, children }: { pos: any; active: boolean; children?: any }) => (
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
    {children}
  </Map.Marker>
);

// -- New Visit Modal
export interface NewVisitModalProps {
  pos?: any;
  setNewVisitPOS: React.Dispatch<any>;
  users: any[];
  visitDate: Date;
  revalidate: any;
}

export const NewVisitModal = ({ pos, setNewVisitPOS, users, visitDate, revalidate }: NewVisitModalProps) => {
  const [selectedUser, setSelectedUser] = useState<any>(undefined);
  const [visitStartTime, setVisitStartTime] = useState<Date>(new Date());
  const [visitDuration, setVisitDuration] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { query } = useRouter();
  let projectID = query['projectID'] ? Buffer.from(query['projectID'] as string, 'base64').toString() : undefined;

  const { getAccessTokenSilently } = useAuth0();

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

  const selectUser = (name: string) => {
    let user = users.find((u) => u.name === name);
    console.log(user, name);
    if (!user) {
      setSelectedUser(undefined);
    } else if (user !== selectedUser) {
      setSelectedUser(user);
    }
  };

  const intervalReducer = (action: 'INCREASE' | 'DECREASE') => {
    switch (action) {
      case 'INCREASE':
        setVisitDuration(visitDuration + VISIT_DURATION_BLOCK);
        break;
      case 'DECREASE':
        if (visitDuration >= VISIT_DURATION_BLOCK) {
          setVisitDuration(visitDuration - VISIT_DURATION_BLOCK);
        }
        break;
    }
  };

  const submitVisit = async () => {
    if (!selectedUser || !visitDate || !visitDuration || !visitStartTime || !pos || !projectID) {
      return;
    }

    setLoading(true);
    let accessToken = await getAccessTokenSilently();

    let expectedStartDateObject = new Date(
      visitDate.getFullYear(),
      visitDate.getMonth(),
      visitDate.getDate(),
      visitStartTime.getHours(),
      visitStartTime.getMinutes()
    );

    let expectedEndDateObject = addMinutes(expectedStartDateObject, visitDuration);

    let payload = {
      expectedStartTimestamp: expectedStartDateObject.toISOString(),
      expectedEndTimestamp: expectedEndDateObject.toISOString(),
      project: projectID,
      user_id: selectedUser.user_id,
    };

    try {
      let response = axios.put(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/pos/${pos.id}/visits`, payload, {
        headers: { Authentication: `Bearer ${accessToken}` },
      });
      toast.success('Visita Agendada com Sucesso ✔', { toastId: 'newVisitSuccess' });
      console.log(response);
      setLoading(false);
      setNewVisitPOS(undefined);
      revalidate();
    } catch (err) {
      toast.error(err, { toastId: 'newVisitError' });
      setLoading(false);
    }
  };

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative my-6 mx-auto w-[48rem] '>
          {/*content*/}
          {loading ? (
            <LoadingAnimation />
          ) : (
            <motion.div
              initial='closed'
              animate='open'
              exit='closed'
              variants={{ open: { opacity: 1, scale: 1 }, closed: { opacity: 0, scale: 0 } }}
              className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'
            >
              {/*header*/}
              <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
                {pos && <h3 className='text-3xl font-semibold'>Agendar Visita</h3>}
              </div>
              {/*body*/}
              <div className='relative p-6 flex flex-col gap-5'>
                <div className='flex flex-row justify-between px-5'>
                  <div className='w-full'>
                    <Typography variant='p' className='leading-relaxed' bold>
                      Colaborador Responsável
                    </Typography>
                    <div className='relative inline-block w-full text-gray-700'>
                      <select
                        className='w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline cursor-pointer'
                        onChange={(event) => selectUser(event.target.value)}
                        value={selectedUser && selectedUser.name ? selectedUser.name : ''}
                      >
                        <option value='' hidden disabled>
                          Selecione um Colaborador
                        </option>
                        {users.map((user) => (
                          <option key={user.user_id} value={user.name}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
                        <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                          <path
                            d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                            clipRule='evenodd'
                            fillRule='evenodd'
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-row justify-between gap-5 px-5'>
                  <div>
                    <Typography variant='p' className='leading-relaxed' bold>
                      Ponto de Venda
                    </Typography>
                    <Typography variant='p' className='leading-relaxed' muted>
                      {pos.name}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant='p' className='leading-relaxed' bold>
                      Data
                    </Typography>
                    <Typography variant='p' className='leading-relaxed' muted>
                      {visitDate.toLocaleDateString()}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant='p' className='leading-relaxed' bold>
                      Horario Previsto
                    </Typography>
                    <DatePicker
                      className='text-xs text-gray-600'
                      datePickerClassName='bg-gray-100 dark:bg-gray-700 hover:bg-yellow-300'
                      placeholderText='Selecione um Horário'
                      onChange={(date) => setVisitStartTime(date as Date)}
                      selected={visitStartTime}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption='Horário'
                      dateFormat='HH:mm'
                      locale='pt-br'
                    />
                  </div>

                  <div>
                    <Typography variant='p' className='leading-relaxed' bold>
                      Duração Prevista (Minutos)
                    </Typography>

                    <div className=' w-max outline-none focus-within:outline-none focus:outline-none'>
                      <div className='flex flex-row w-full rounded-lg relative bg-transparent '>
                        <button
                          onClick={() => intervalReducer('DECREASE')}
                          className='z-10 py-1 px-3 -mr-5 bg-gray-100 dark:bg-gray-700 hover:bg-yellow-300 rounded-l cursor-pointer outline-none focus:outline-none'
                        >
                          <Typography variant='span' className='m-auto text-sm font-thin'>
                            −
                          </Typography>
                        </button>
                        <input
                          disabled
                          type='number'
                          className='py-1 focus:appearance-none focus:outline-none text-center w-full bg-gray-100 dark:bg-gray-700 font-semibold text-sm md:text-basecursor-default flex items-center text-gray-700  outline-none'
                          value={visitDuration}
                          onChange={(e) => setVisitDuration(e.target.valueAsNumber)}
                        />
                        <button
                          onClick={() => intervalReducer('INCREASE')}
                          className='z-10 py-1 px-3 -ml-5 bg-gray-100 dark:bg-gray-700 hover:bg-yellow-300  rounded-r cursor-pointer focus:outline-none'
                        >
                          <span className='m-auto text-sm font-thin'>+</span>
                        </button>
                      </div>
                    </div>

                    {/*<></>*/}
                  </div>
                </div>
              </div>
              {/*footer*/}
              <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
                <button
                  className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                  type='button'
                  onClick={() => setNewVisitPOS(undefined)}
                >
                  Cancelar
                </button>
                <button
                  className='bg-green-500 text-white active:bg-green-600 disabled:bg-gray-100 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg disabled:shadow-none disabled:hover:shadow-none active:shadow-none outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                  type='button'
                  disabled={!selectedUser || visitDuration === 0 || !visitStartTime}
                  onClick={submitVisit}
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          )}
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

  const { show } = useContextMenu();

  const [mapFocus, setMapFocus] = useState<{ latitude: number; longitude: number; zoom?: number }>({
    latitude: -14.2401,
    longitude: -53.1805,
    zoom: 3,
  });

  const [visitDate, setVisitDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const [selectedPOS, setSelectedPOS] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newVisitPOS, setNewVisitPOS] = useState<any | undefined>();
  const [loadedVisits, setLoadedVisits] = useState<{ visits: any[]; routes: any[] }>(undefined);
  const [polyline, setPolyline] = useState<any>(undefined);
  const [fetchVisits, setFetchVisits] = useState(true);

  const { getAccessTokenSilently } = useAuth0();

  const {
    data: projectData,
    error: projectError,
    isLoading: projectLoading,
  } = useApi(`projects/${projectID}?r=company&r=pos&r=visits&r=visits.pos`);

  const { data: userData, error: userError, isLoading: userLoading } = useApi(`auth/users`);

  useEffect(() => {
    setLoadedVisits(undefined);
    setPolyline(undefined);
    if (selectedUsers.length === 0) {
      console.log('out (len = 0)');
      return;
    }

    if (selectedUsers.length > 1) {
      toast.warning(
        'Atualmente só conseguimos mostrar as rotas de um colaborador por vez. Estamos trabalhando para trazer melhores visualizações para você.',
        { toastId: 'oneColabVisitWarning' }
      );
      return;
    }

    let from = new Date(visitDate).toISOString();
    let to = new Date(new Date(visitDate).setDate(visitDate.getDate() + 1)).toISOString();
    let user = selectedUsers[0].user_id;
    let url = `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/projects/${projectID}/visits`;

    getAccessTokenSilently()
      .then((accessToken) =>
        axios
          .get(url, {
            headers: { Authentication: `Bearer ${accessToken}` },
            params: { fromExpected: from, toExpected: to, user: user, r: ['pos'], route: true },
          })
          .then((result) => {
            console.log(result.data);
            let visits = result.data;
            setLoadedVisits(visits);

            if (
              visits.routes &&
              visits.routes.routes[0] &&
              visits.routes.routes[0].overview_polyline &&
              visits.routes.routes[0].overview_polyline.points
            ) {
              console.log(visits.routes.routes[0].overview_polyline.points);
              setPolyline(toGeoJSON(visits.routes.routes[0].overview_polyline.points));
            }

            console.log(polyline);
          })
          .catch((err) => {
            console.error(err);
            //toast.warning('O Colaborador Ainda Não Possui Visitas Agendadas', { toastId: 'noVisitsWarning' });
          })
      )
      .catch((err) => {
        console.error(err);
        toast.error(err.message, { toastId: 'visitsError' });
      })
      .finally(() => {
        if (fetchVisits) {
          setFetchVisits(false);
        }
      });

    console.log('out');
  }, [visitDate, selectedUsers, fetchVisits]);

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
              {selectedPOS &&
                selectedPOS.map(
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
              {loadedVisits &&
                loadedVisits.visits.map((visit: any) => {
                  let displayContextMenu = (e: TriggerEvent) => {
                    e.stopPropagation();
                    show(e, { id: visit.id, props: { id: visit.id } });
                  };

                  return (
                    visit.pos.address && (
                      <>
                        <div onContextMenu={(e) => displayContextMenu(e)}>
                          <POSMarker
                            key={visit.id}
                            pos={visit.pos}
                            active={
                              parseFloat(visit.pos.address.lat) == mapFocus.latitude &&
                              parseFloat(visit.pos.address.lng) == mapFocus.longitude
                            }
                          >
                            <Typography variant='p'>Data {new Date(visit.expectedStartTimestamp).toLocaleString()}</Typography>
                          </POSMarker>
                        </div>
                        <VisitMarkerContextMenu visit={visit} revalidate={() => setFetchVisits(true)} />
                      </>
                    )
                  );
                })}
              {polyline && (
                <Source id='polylineLayer' type='geojson' data={polyline as any}>
                  <Layer
                    id='lineLayer'
                    type='line'
                    source='my-data'
                    layout={{
                      'line-join': 'round',
                      'line-cap': 'round',
                    }}
                    paint={{
                      'line-color': 'rgba(3, 170, 238, 0.5)',
                      'line-width': 5,
                    }}
                  />
                </Source>
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
        <AnimatePresence>
          {newVisitPOS && (
            <NewVisitModal
              pos={newVisitPOS}
              setNewVisitPOS={setNewVisitPOS}
              visitDate={visitDate}
              users={userData}
              revalidate={() => setFetchVisits(true)}
            />
          )}
        </AnimatePresence>
      </Layout.Content>
    </Layout>
  );
};

export default withAuthenticationRequired(Visits);
