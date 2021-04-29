import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Typography, LoadingAnimation, Form } from 'components';
import * as yup from 'yup';
import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

type NewCustomerFormType = {
  name: string;
  CNPJ: string;
};

const NewCustomerForm = () => {
  const [isLoading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const formRef = useRef<any>();

  const formSchema = yup.object().shape({
    name: yup.string().required(),
    CNPJ: yup
      .string()
      .matches(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})$/, { message: 'Deve ser um CNPJ Válido.', excludeEmptyString: true })
      .required(),
  });

  const createCustomer = async (data: NewCustomerFormType) => {
    setLoading(true);
    let accessToken = await getAccessTokenSilently();

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/companies`,
        { ...data },
        { headers: { Authentication: `Bearer ${accessToken}` } }
      );
      toast.success('Cliente criado com sucesso ! 😀');
      if (formRef && formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      console.error(err);
      switch (err.response.status) {
        case 409:
          toast.error(`Cliente já cadastrado.`, { toastId: 'customers/new/customerNameTakenError' });
          break;
        default:
          toast.error(`Não conseguimos criar o cliente no momento. 🙁 [${err.response.status}]`, {
            toastId: 'customers/new/defaultError',
          });
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-full h-full'>
        <Form<NewCustomerFormType>
          externalRef={formRef}
          onSubmit={(data) => {
            createCustomer(data);
          }}
          submitLabel='Novo Cliente'
          schema={formSchema}
          fieldsOptions={{
            name: { type: 'text', autoComplete: 'name', label: 'Nome do Cliente' },
            CNPJ: { type: 'text', label: 'CNPJ', mask: '99.999.999/9999-99' },
          }}
          defaultValues={{
            name: '',
            CNPJ: '',
          }}
          classNames={{
            grid: 'md:grid-cols-6',
            name: 'md:col-span-4',
            CNPJ: 'md:col-span-2',
          }}
        />
      </div>
      {isLoading && <LoadingAnimation size='xs' />}
    </>
  );
};

export interface NewCustomerPageProps {}

export const NewCustomerPage = ({}: NewCustomerPageProps) => {
  return (
    <div className='h-full w-full'>
      <div className='flex flex-row justify-center md:justify-between mb-10'>
        <Typography variant='h3'>Novo Parceiro</Typography>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <NewCustomerForm />
      </div>
    </div>
  );
};

export default withAuthenticationRequired(NewCustomerPage);
