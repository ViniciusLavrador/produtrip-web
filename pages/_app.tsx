import { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';

// Auth0
import { AppState, Auth0Provider, useAuth0 } from '@auth0/auth0-react';

// React Tostify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Socket.IO
import { SocketIOProvider } from 'components/SocketIO'; // Testing use-socket.io

// CSS (tailwind)
import '../styles/globals.css';
import { Navbar } from 'components';

// Framer
import { AnimateSharedLayout, motion } from 'framer-motion';

// React Contexify
import 'react-contexify/dist/ReactContexify.css';

import * as Yup from 'yup';
import { ptForm } from 'yup-locale-pt';

import ptBR from 'date-fns/locale/pt-BR';
import { useEffect } from 'react';
import { registerLocale } from 'react-datepicker';
import { RecoilRoot } from 'recoil';

const onRedirectCallback = (appState: AppState) => {
  Router.replace(appState?.returnTo || '/');
};

export default function App({ Component, pageProps, router }: AppProps) {
  Yup.setLocale(ptForm);

  useEffect(() => {
    registerLocale('pt-br', ptBR);
  }, [ptBR]);

  return (
    <RecoilRoot>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_TENANT_DOMAIN}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
        redirectUri={typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_DOMAIN}
        onRedirectCallback={onRedirectCallback}
      >
        <SocketIOProvider url='http://api.produtrip.com.br:3001'>
          <Head>
            <title>Gestão de PDV - Produtrip</title>
          </Head>
          <Navbar>
            <motion.div
              key={router.route}
              className='h-full w-full'
              initial='pageInitial'
              animate='pageAnimate'
              variants={{
                pageInitial: {
                  opacity: 0,
                },
                pageAnimate: {
                  opacity: 1,
                },
              }}
            >
              <Component {...pageProps} />
            </motion.div>
          </Navbar>
          <ToastContainer limit={3} position='top-center' />
        </SocketIOProvider>
      </Auth0Provider>
    </RecoilRoot>
  );
}
