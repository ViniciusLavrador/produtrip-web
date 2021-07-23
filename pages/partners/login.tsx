import cx from 'classnames';
import { ExtendedLogo, Button, Typography } from 'components';
// import Input from 'components/Form/Input';
import { useRouter } from 'next/router';
import { ChangeEventHandler, useEffect, useState } from 'react';

const PARTNER_AUTH_CODE_LENGTH = 49;

const LogoRow = () => {
  return (
    <>
      <div className='hidden md:block'>
        <ExtendedLogo />
      </div>
      <div className='md:hidden'>
        <ExtendedLogo size='xs' />
      </div>
    </>
  );
};

export interface LoginProps {}

export const Login = ({}: LoginProps) => {
  const [partnerAuthCode, setPartnerAuthCode] = useState('');

  const onPartnerCodeChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (target.value.length <= PARTNER_AUTH_CODE_LENGTH) {
      setPartnerAuthCode(target.value.toUpperCase());
    }
  };

  const router = useRouter();

  const rootClasses = cx('flex', 'h-screen w-screen', 'justify-center items-center');

  const welcomeContainerClasses = cx(
    'flex flex-col',
    'max-w-xs md:max-w-none md:w-5/12',
    'gap-5',
    'py-5',
    'px-0 md:px-10',
    'border-2  rounded-3xl border-gray-300 dark:border-gray-600',
    'bg-white dark:bg-gray-800',
    'shadow-lg'
  );

  const actionRow = cx('flex flex-col md:flex-row', 'gap-5', 'pb-5 pt-2 px-10 md:px-0');

  return (
    <div className={rootClasses}>
      <div className={welcomeContainerClasses}>
        <LogoRow />
        <Typography variant='h6' className='text-center'>
          Insira um <b>Código de Parceiro</b>.
        </Typography>

        <div className='flex flex-col w-full gap-2'>
          {/* <Input
            name='partnerAuthCode'
            placeholder='Código de Autênticação de Parceiro'
            value={partnerAuthCode}
            onChange={onPartnerCodeChange}
          /> */}
          <div className={actionRow}>
            <Button href='/' className='w-full font-bold' label='Voltar' />
            <Button
              primary
              className='w-full font-bold'
              disabled={partnerAuthCode.length !== PARTNER_AUTH_CODE_LENGTH}
              onClick={() => router.push(`/partners/${partnerAuthCode}`)} // Has to be a Clickable Button so it can be disabled
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
