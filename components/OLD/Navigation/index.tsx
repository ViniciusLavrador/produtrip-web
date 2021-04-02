import { useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Logo from '../../Logo/Logo';
import Menu from './Menu';
import { Header, Avatar, Box, Collapsible, Main, Text } from 'grommet';

interface NavigationProps {
  children: ReactNode;
  user?: any;
}

export const Navigation = ({ children, user }: NavigationProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);

  return (
    <Main fill pad='medium'>
      <Header justify='between' pad='small'>
        <Logo onClick={() => setOpen(!open)} open={open} />
        {user && (
          <Box
            onMouseLeave={() => setUsernameOpen(false)}
            onMouseEnter={() => setUsernameOpen(true)}
            onClick={() => router.push('/me')}
            direction='row'
            background={{ dark: 'light-1', light: 'dark-1' }}
            round
            align='center'
          >
            <Avatar src={user.picture} margin={{ right: 'small' }} />
            <Collapsible open={usernameOpen} direction='horizontal'>
              <Text size='small' margin={{ right: 'medium' }}>
                @{user.nickname}
              </Text>
            </Collapsible>
          </Box>
        )}
      </Header>
      <Box fill direction='row' gap='medium' responsive>
        {/* Altered Source Code on Collapsible to use useEffect instead of useLayoutEffect to prevent react SSR Hydration Warning   */}
        <Collapsible open={open} direction='vertical'>
          <Menu />
        </Collapsible>
        {children}
      </Box>
    </Main>
  );
};

export default Navigation;
