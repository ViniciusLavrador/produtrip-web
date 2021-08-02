import { useRef, useState } from 'react';
import { SocketIOContext } from './context';
import { io, ManagerOptions, SocketOptions, Socket } from 'socket.io-client';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export interface ISocketIOProviderProps {
  url: string;
  opts?: Partial<ManagerOptions & SocketOptions>;
}

export const SocketIOProvider: React.FC<ISocketIOProviderProps> = ({ url, opts, children }) => {
  const socketRef = useRef<Socket>();

  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  if (!socketRef.current) {
    socketRef.current = io(url, opts || {});
    console.log('Establishing Socket Connection', socketRef.current, socketRef.current.connected);

    socketRef.current.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socketRef.current.on('connect', () => {
      console.log(`connected`);
    });

    socketRef.current.connect();
  }

  return <SocketIOContext.Provider value={socketRef.current}>{children}</SocketIOContext.Provider>;
};
