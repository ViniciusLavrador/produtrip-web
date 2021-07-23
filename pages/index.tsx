import { useRouter } from 'next/router';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import cx from 'classnames';
import { ExtendedLogo, Button, Logo, Typography, DatePicker, LoadingAnimation } from 'components';
import { useEffect } from 'react';
import { Map } from 'components/Map/Map';
import { useState } from 'react';
import axios from 'axios';
import { CalendarSolidIcon } from 'public/icons/solid';
import { ChevronLeftOutlineIcon, ChevronRightOutlineIcon, DuplicateOutlineIcon, XOutlineIcon } from 'public/icons/outline';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { visitInProgressAtom } from 'recoil/atoms';
import visits from './visits';
import { useThemeMode } from 'hooks';
import { Layer, Source } from 'react-map-gl';
import { Item, Menu } from 'react-contexify';
import { toGeoJSON } from '@mapbox/polyline';

const PARTNERS_LOGIN_URL = '/partners/login';

const WelcomePage = () => {
  const { loginWithRedirect } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(PARTNERS_LOGIN_URL);
  }, []);

  const redirectToPartners = () => {
    router.push(PARTNERS_LOGIN_URL);
  };

  const rootClasses = cx('flex', 'h-screen w-screen', 'justify-center items-center');
  const welcomeContainerClasses = cx(
    'flex flex-col',
    'max-w-xs md:max-w-none',
    'gap-5',
    'py-5',
    'px-0 md:px-10',
    'border-2  rounded-3xl border-gray-300 dark:border-gray-600',
    'bg-white dark:bg-gray-800',
    'shadow-lg'
  );
  const actionRow = cx('flex flex-col md:flex-row', 'gap-5', 'py-10 px-10 md:px-0');

  return (
    <div className={rootClasses}>
      <div className={welcomeContainerClasses}>
        <div className='hidden md:block'>
          <ExtendedLogo />
        </div>
        <div className='md:hidden'>
          <ExtendedLogo size='xs' />
        </div>
        <div className={actionRow}>
          <Button primary onClick={loginWithRedirect} label='Sou um Colaborador' />
          <Button primary disabled onClick={redirectToPartners} label='Sou um Parceiro' />
        </div>
      </div>
    </div>
  );
};

const AuthenticatedAdminHomePage = withAuthenticationRequired(() => {
  const rootClasses = cx('w-full h-full flex justify-center items-center');

  return (
    <div className={rootClasses}>
      <Logo size='3xl' className='opacity-30' />
    </div>
  );
});

const AuthenticatedUserHomePage = withAuthenticationRequired<{ user: any }>(({ user }) => {
  const rootClasses = cx('w-full h-full');
  const [userVisits, setUserVisits] = useState<any>();

  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const [polyline, setPolyline] = useState<any>(undefined);

  const [visitInProgress, setVisitInProgress] = useRecoilState(visitInProgressAtom);

  const [mapFocus, setMapFocus] = useState<{ latitude: number; longitude: number; zoom?: number }>({
    latitude: -14.2401,
    longitude: -53.1805,
    zoom: 3,
  });

  useEffect(() => {
    setPolyline(undefined);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/visits?date=${new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate()
        )}&user=${user.sub}&route=true`
      )
      .then((response) => {
        console.log('response', response);
        setUserVisits(response.data);

        if (
          response.data.routes &&
          response.data.routes.routes[0] &&
          response.data.routes.routes[0].overview_polyline &&
          response.data.routes.routes[0].overview_polyline.points
        ) {
          console.log(response.data.routes.routes[0].overview_polyline.points);
          setPolyline(toGeoJSON(response.data.routes.routes[0].overview_polyline.points));
        }

        response.data.visits.map((visit) => {
          visit.status === 'IN_PROGESS' && setVisitInProgress(visit);
        });
      })
      .catch((err) => {
        console.warn(err);
        setUserVisits([]);
      });
  }, [user, date]);

  // Start or End a Visitation
  const changeVisitationStatus = (visit) => {
    if (visit.startTimestamp) {
      axios
        .patch(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/pos/${visit.pos.id}/visits/${visit.id}/end`)
        .then((response) => {
          console.log(response);
          setVisitInProgress(undefined);
          toast.success('Visita Encerrada !');
        })
        .catch((err) => {
          toast.error('Não Consegui Finalizar a Visita. Por Favor, Tente Novamente em alguns instantes.');
          console.error(err);
          setVisitInProgress(undefined);
        });
      return;
    } else {
      if (!!visitInProgress) {
        toast.warning('Visita em Progresso. Não podemos iniciar a visita.');
        return;
      }
      axios
        .patch(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/pos/${visit.pos.id}/visits/${visit.id}/start`)
        .then((response) => {
          console.log(response);
          setVisitInProgress(visit);
          toast.success('Visita Iniciada !');
        })
        .catch((err) => {
          toast.error('Não Consegui Iniciar a Visita. Por Favor, Tente Novamente em alguns instantes.');
          console.error(err);
          setVisitInProgress(undefined);
        });
      return;
    }
  };

  return (
    <div className={rootClasses}>
      <div className='mb-5 p-5 flex flex-col lg:flex-row justify-between items-center'>
        <Typography variant='h3'>Visitas</Typography>
        <div
          className='cursor-pointer flex flex-row items-center group lg:hover:rounded lg:hover:bg-yellow-300 ;g:hover:bg-opacity-70 px-5 py-3'
          onClick={() =>
            date.getDate() === new Date(Date.now()).getDate()
              ? setDate(new Date(date.setDate(date.getDate() + 1)))
              : setDate(new Date(date.setDate(date.getDate() - 1)))
          }
        >
          {date.getDate() !== new Date(Date.now()).getDate() && (
            <div className='mr-2 lg:hidden lg:group-hover:block'>
              <Typography variant='span' muted className='lg:group-hover:text-black'>
                <ChevronLeftOutlineIcon />
              </Typography>
            </div>
          )}
          <Typography variant='h6' muted className='lg:group-hover:text-black'>
            {date.toLocaleDateString()}
          </Typography>
          {date.getDate() === new Date(Date.now()).getDate() && (
            <div className='ml-2 lg:hidden lg:group-hover:block'>
              <Typography variant='span' muted className='lg:group-hover:text-black'>
                <ChevronRightOutlineIcon />
              </Typography>
            </div>
          )}
        </div>
      </div>
      <div className='grid grid-cols-12'>
        <div className='col-span-full lg:col-span-3 h-full text-center'>
          <ul className='h-full flex flex-col gap-3 overflow-y-scroll'>
            {(!userVisits || !userVisits.visits || userVisits.visits.length === 0) && (
              <Typography variant='h6' muted bold>
                Nenhuma Visita Agendada
              </Typography>
            )}
            {userVisits &&
              userVisits.visits
                .sort((a, b) => new Date(a.expectedStartTimestamp).getTime() - new Date(b.expectedStartTimestamp).getTime())
                .map((visit) => {
                  return (
                    <li
                      className={cx(
                        'py-3 px-5 rounded-lg cursor-pointer',
                        { 'bg-gray-200': !(!!visit.startTimestamp && !visit.endTimestamp) },
                        { 'bg-yellow-200': !!visit.startTimestamp && !visit.endTimestamp },
                        { 'bg-green-200': !!visit.endTimestamp }
                      )}
                      key={visit.id}
                      onClick={() => changeVisitationStatus(visit)}
                    >
                      <Typography variant='span' bold className='ml-1'>
                        {visit.pos.name} - {new Date(visit.expectedStartTimestamp).toLocaleTimeString()}
                      </Typography>
                    </li>
                  );
                })}
          </ul>
        </div>
        <div className='col-span-full mt-10 lg:mt-0 lg:col-span-9'>
          {!!visitInProgress ? (
            <LoadingAnimation />
          ) : (
            <>
              {(!userVisits || !userVisits.visits || userVisits.visits.length !== 0) && (
                <div className='h-[400px] lg:h-[550px] rounded shadow'>
                  <Map latitude={mapFocus.latitude} longitude={mapFocus.longitude} zoom={mapFocus.zoom}>
                    {userVisits &&
                      userVisits.visits &&
                      userVisits.visits.map(
                        (visit: any) =>
                          visit.pos.address && (
                            <POSMarker
                              visited={visit.endTimestamp}
                              key={visit.pos.id}
                              pos={visit.pos}
                              active={
                                parseFloat(visit.pos.address.lat) == mapFocus.latitude &&
                                parseFloat(visit.pos.address.lng) == mapFocus.longitude
                              }
                            />
                          )
                      )}

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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const HomePage = () => {
  const { isAuthenticated, user } = useAuth0();

  if (!isAuthenticated) return <WelcomePage />;

  let isAdmin = user && user[Object.keys(user).filter((key) => /roles/)[0]].includes('ADMIN');

  if (isAuthenticated && isAdmin) return <AuthenticatedAdminHomePage />;
  if (isAuthenticated && !isAdmin) return <AuthenticatedUserHomePage user={user} />;
};

export default HomePage;

const toClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('✔️ Copiado com sucesso !', { toastId: 'successCopy' });
};

const POSMarker = ({ pos, active, children, visited }: { pos: any; active: boolean; visited: boolean; children?: any }) => (
  <Map.Marker
    active={active}
    longitude={parseFloat(pos.address.lng)}
    latitude={parseFloat(pos.address.lat)}
    className={cx({ 'text-green-400': visited })}
  >
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
