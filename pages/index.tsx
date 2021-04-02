import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { ExtendedLogo, Typography } from '../components';
import Navbar from '../components/Navigation/Navbar';

export const HomePage = () => {
  const { isAuthenticated, error, loginWithPopup } = useAuth0();
  const { push: pushRoute } = useRouter();

  return (
    <>
      <div className='bg-red-400 mt-64'>
        <ExtendedLogo direction='row' size='xs' />
      </div>
    </>
  );

  //   useEffect(() => {
  //     if (error) toast.error(`Usuário ou Senha Inválido ! (${error})`, { toastId: 'invalidAuth' });
  //   }, [error]);

  //   useEffect(() => {
  //     if (isAuthenticated) {
  //       pushRoute('/admin', );
  //     }
  //   }, [isAuthenticated]);

  //   if (!isAuthenticated) {
  //     return (
  //       <Main justify='center' align='center'>
  //         <Box justify='center' gap='large'>
  //           <Box round border direction='column' justify='between' pad='medium' gap='large'>
  //             <Box justify='center' direction='row'>
  //               <Logo scale={1.3} />
  //             </Box>
  //             <Box direction='row' justify='center'></Box>
  //             <Box gap='medium' direction='row'>
  //               <Button
  //                 label={<Text size='small'>Sou um Colaborador</Text>}
  //                 hoverIndicator
  //                 fill='horizontal'
  //                 size='medium'
  //                 onClick={() => loginWithPopup()}
  //               />
  //               <Button
  //                 primary
  //                 label={<Text size='small'>Sou um Parceiro</Text>}
  //                 fill='horizontal'
  //                 size='medium'
  //                 onClick={() => pushRoute('/partner')}
  //               />
  //             </Box>
  //           </Box>
  //         </Box>
  //       </Main>
  //    );
  //  }
};

export default HomePage;
