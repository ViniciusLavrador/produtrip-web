import { useEffect, useState } from 'react';
import { GetTokenSilentlyOptions, useAuth0 } from '@auth0/auth0-react';
import useSWR from 'swr';

export const useApi = (resource: string, fetchOptions?: RequestInit, getTokenSilentlyOptions?: GetTokenSilentlyOptions) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: true,
  });

  const { getAccessTokenSilently } = useAuth0();
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/${resource}`, async (url) => {
    // FIX PORT NUMBER
    const accessToken = await getAccessTokenSilently({
      audience: process.env.NEXT_PUBLIC_API_SERVER_DOMAIN,
      ...getTokenSilentlyOptions,
    });

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });

    return response.json();
  });

  useEffect(() => {
    if (error) {
      setState({
        ...state,
        error,
        isLoading: false,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setState({
        ...state,
        data,
        isLoading: false,
      });
    }
  }, [data]);

  return state;
};
