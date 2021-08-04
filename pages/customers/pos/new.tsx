import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Typography, LoadingAnimation, Form } from 'components';
import * as yup from 'yup';
import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useApi } from 'hooks';
import Layout from 'components/Layout/Layout';

type NewPOSFormType = {
  name: string;
  address: string;
};

const NewPOSForm = () => {
  const [isLoading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const router = useRouter();
  let companyID = Buffer.from(router.query['company'] as string, 'base64').toString();

  const formRef = useRef<any>();

  const formSchema = yup.object().shape({
    name: yup.string().required(),
    address: yup.string(),
  });

  const createPOS = async (data: NewPOSFormType) => {
    setLoading(true);
    let accessToken = await getAccessTokenSilently();

    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/pos`,
        { company: companyID, isActive: false, name: data.name, place_id: data.address },
        { headers: { Authentication: `Bearer ${accessToken}` } }
      );

      toast.success('PDV criado com sucesso ! 😀');
      console.log(result);
      setLoading(false);
      router.push(`/customers/${router.query['company']}`);
    } catch (err) {
      console.error(err);
      switch (err.response.status) {
        case 409:
          toast.error(`PDV já cadastrado.`, { toastId: 'pos/new/posTakenError' });
          break;
        default:
          toast.error(`Não conseguimos criar o PDV no momento. 🙁 [${err.response.status}]`, {
            toastId: 'pos/new/defaultError',
          });
          break;
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-full h-full'>
        <Form<NewPOSFormType>
          externalRef={formRef}
          onSubmit={(formData) => {
            createPOS(formData);
          }}
          submitLabel={`Novo PDV`}
          schema={formSchema}
          fieldsOptions={{
            name: { type: 'text', autoComplete: 'name', label: 'Apelido do PDV' },
            address: { type: 'text', autoComplete: 'address-line1', label: 'Endereço' }, // FIX MASK
          }}
          defaultValues={{
            name: '',
            address: '',
          }}
          classNames={{
            grid: 'md:grid-cols-6',
            name: 'md:col-span-2',
            address: 'md:col-span-4',
          }}
        />
      </div>
      {isLoading && <LoadingAnimation size='xs' />}
    </>
  );
};

export interface NewCustomerPageProps {}

export const NewCustomerPage = ({}: NewCustomerPageProps) => {
  const router = useRouter();
  let companyID = Buffer.from(router.query['company'] as string, 'base64').toString();

  const { data, isLoading, error } = useApi(`companies/${companyID}`);

  if (error) {
    toast.error('Cliente não encontrado.');
    router.push('/customers');
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: 'Novo Ponto de Venda' },
          list: [
            { title: 'Clientes', href: '/customers' },
            { title: data && data.name, href: `/customers/${router.query['company']}` },
          ],
        }}
      />
      <Layout.Content>
        <div className='flex flex-col items-center justify-center'>
          <NewPOSForm />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default withAuthenticationRequired(NewCustomerPage);
