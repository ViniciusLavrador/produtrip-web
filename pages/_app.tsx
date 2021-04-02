import { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';

// Auth0
import { AppState, Auth0Provider, useAuth0 } from '@auth0/auth0-react';

// React Tostify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Socket.IO
import { SocketIOProvider } from 'use-socketio'; // Testing use-socket.io

// CSS (tailwind)
import '../styles/globals.css';
import { useEffect } from 'react';
import { useThemeMode } from '../hooks';
import Navbar from '../components/Navigation/Navbar';

const onRedirectCallback = (appState: AppState) => {
  Router.replace(appState?.returnTo || '/');
};

export default function App({ Component, pageProps }: AppProps) {
  const { currentMode } = useThemeMode();
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    document.querySelector('html').classList.add(currentMode);
  }, [currentMode]);

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_TENANT_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_DOMAIN}
      onRedirectCallback={onRedirectCallback}
    >
      <Head>
        <title>Gestão de PDV - Produtrip</title>
      </Head>
      {/* <SocketIOProvider url={process.env.NEXT_PUBLIC_SOCKETIO_SERVER_DOMAIN}> */}
      {!isAuthenticated ? (
        <>
          <Navbar>
            <Component {...pageProps} />
          </Navbar>
        </>
      ) : (
        <Component {...pageProps} />
      )}
      <ToastContainer limit={3} />
      {/* </SocketIOProvider> */}
    </Auth0Provider>
  );
}
