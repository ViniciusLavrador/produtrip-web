import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { LoadingAnimation, Form } from 'components';
import * as yup from 'yup';
import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useApi } from 'hooks';
import Layout from 'components/Layout/Layout';

type NewProjectFormType = {
  name: string;
  contract: string;
};

const NewProjectForm = () => {
  const [isLoading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const router = useRouter();
  let companyID = Buffer.from(router.query['company'] as string, 'base64').toString();

  const formRef = useRef<any>();

  const formSchema = yup.object().shape({
    name: yup.string().required(),
    contract: yup.string().required(),
  });

  const createProject = async (data: NewProjectFormType) => {
    setLoading(true);
    let accessToken = await getAccessTokenSilently();

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/projects`,
        { company: companyID, isActive: false, ...data },
        { headers: { Authentication: `Bearer ${accessToken}` } }
      );
      toast.success('Projeto criado com sucesso ! 😀');
      if (formRef && formRef.current) {
        formRef.current.reset();
      }
      setLoading(false);
      router.push(`/customers/${router.query['company']}`);
    } catch (err) {
      console.error(err);
      switch (err.response.status) {
        case 409:
          toast.error(`Projeto já cadastrado.`, { toastId: 'projects/new/projectTakenError' });
          break;
        default:
          toast.error(`Não conseguimos criar o projeto no momento. 🙁 [${err.response.status}]`, {
            toastId: 'projects/new/defaultError',
          });
          break;
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-full h-full'>
        <Form<NewProjectFormType>
          externalRef={formRef}
          onSubmit={(formData) => {
            createProject(formData);
          }}
          submitLabel={`Novo Projeto`}
          schema={formSchema}
          fieldsOptions={{
            name: { type: 'text', autoComplete: 'name', label: 'Nome do Projeto' },
            contract: { type: 'text', label: 'Contrato' }, // FIX MASK
          }}
          defaultValues={{
            name: '',
            contract: '',
          }}
          classNames={{
            grid: 'md:grid-cols-6',
            name: 'md:col-span-4',
            contract: 'md:col-span-2',
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

  const { data, error, isLoading } = useApi(`companies/${companyID}`);

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
          main: { title: 'Novo Projeto' },
          list: [
            { title: 'Clientes', href: '/customers' },
            { title: data && data.name, href: `/customers/${router.query['company']}` },
          ],
        }}
      />
      <Layout.Content>
        <div className='flex flex-col items-center justify-center'>
          <NewProjectForm />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default withAuthenticationRequired(NewCustomerPage);
