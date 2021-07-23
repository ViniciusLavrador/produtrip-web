import { useEffect, useState } from 'react';
import { GetTokenSilentlyOptions, useAuth0 } from '@auth0/auth0-react';
import useSWR from 'swr';

export const useApi = (resource: string, fetchOptions?: RequestInit, getTokenSilentlyOptions?: GetTokenSilentlyOptions) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: true,
    revalidate: undefined,
  });

  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
  const { data, error, revalidate } = useSWR(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/${resource}`, async (url) => {
    if (!resource) return;
    // FIX PORT NUMBER
    let accessToken;

    try {
      accessToken = await getAccessTokenSilently({
        audience: process.env.NEXT_PUBLIC_API_SERVER_DOMAIN,
        ...getTokenSilentlyOptions,
      });
    } catch (error) {
      accessToken = await getAccessTokenWithPopup({
        audience: process.env.NEXT_PUBLIC_API_SERVER_DOMAIN,
        ...getTokenSilentlyOptions,
      });
    }

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
        revalidate: revalidate,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setState({
        ...state,
        data,
        isLoading: false,
        revalidate: revalidate,
      });
    }
  }, [data]);

  return state;
};
