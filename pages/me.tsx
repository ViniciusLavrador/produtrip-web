import { withAuthenticationRequired } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { useApi } from '../hooks/useAPI';

export const MePage = () => {
  const resource = `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/companies`;

  const { data, error } = useApi(resource);

  if (error) {
    console.log(error);
  }

  return <>{data && <h1>DATA: {JSON.stringify(data)}</h1>}</>;
};

export default withAuthenticationRequired(MePage);
