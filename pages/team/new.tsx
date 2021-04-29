import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Typography, LoadingAnimation, Form } from 'components';
import * as yup from 'yup';
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

type NewUserFormType = {
  name: string;
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  phone_number?: string;
  CPF?: string;
};

const NewUserForm = () => {
  const [isLoading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const formRef = useRef<any>();

  const createUser = async (data: {
    name: string;
    email: string;
    nickname: string;
    password: string;
    passwordConfirmation: string;
    phone_number?: string;
    CPF?: string;
  }) => {
    setLoading(true);

    let { passwordConfirmation, ...newUserData } = data;

    let accessToken = await getAccessTokenSilently();

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/auth/users`,
        { ...newUserData },
        { headers: { Authentication: `Bearer ${accessToken}` } }
      );
      toast.success('Usuário criado com sucesso ! 😀');
      if (formRef && formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      console.error(err);
      switch (err.response.status) {
        case 409:
          toast.error(`Nome de usuário já utilizado. Por favor, escolha outro.`, { toastId: 'team/new/usernameTaken' });
          break;
        default:
          toast.error(`Não conseguimos criar o usuário no momento. 🙁 [${err.response.status}]`, { toastId: 'usernameTaken' });
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const formSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    nickname: yup.string().required(),
    password: yup.string().required(),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], 'As senhas devem corresponder.'),
    phone_number: yup.string().matches(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/, {
      message: 'Deve ser um Telefone Celular',
      excludeEmptyString: true,
    }),
    CPF: yup
      .string()
      .matches(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/, { message: 'Deve ser um CPF Válido.', excludeEmptyString: true }),
  });

  return (
    <>
      <div className='w-full h-full'>
        <Form<NewUserFormType>
          externalRef={formRef}
          onSubmit={(data) => {
            createUser(data);
          }}
          submitLabel='Novo Colaborador'
          schema={formSchema}
          fieldsOptions={{
            nickname: { type: 'text', autoComplete: 'username', label: 'Nome de Usuário' },
            name: { type: 'text', autoComplete: 'name', label: 'Nome Completo' },
            password: { type: 'password', autoComplete: 'new-password', label: 'Senha' },
            passwordConfirmation: { type: 'password', autoComplete: 'new-password', label: 'Confirmação de Senha' },
            phone_number: { type: 'tel', autoComplete: 'tel', inputMode: 'tel', mask: '+55 (99) 99999-9999', label: 'Celular' },
            email: { type: 'email', autoComplete: 'email', inputMode: 'email', label: 'E-mail' },
            CPF: { type: 'text', mask: '999.999.999-99', label: 'CPF' },
          }}
          classNames={{
            grid: 'md:grid-cols-6',
            name: 'md:col-span-2',
            email: 'md:col-span-2',
            nickname: 'md:col-span-2',
            password: 'md:col-span-2',
            passwordConfirmation: 'md:col-span-2',
            phone_number: 'md:col-span-1',
            CPF: 'md:col-span-1',
          }}
        />
      </div>
      {isLoading && (
        <AnimatePresence>
          <div className='fixed bottom-10 right-10'>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <LoadingAnimation size='xs' />
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
};

export interface NewUserPageProps {}

export const NewUserPage = ({}: NewUserPageProps) => {
  return (
    <div className='h-full w-full'>
      <div className='flex flex-row justify-center md:justify-between mb-10'>
        <Typography variant='h3'>Novo Colaborador</Typography>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <NewUserForm />
      </div>
    </div>
  );
};

export default withAuthenticationRequired(NewUserPage);
