import { useAuth0 } from '@auth0/auth0-react';
import { Button, ButtonProps, Box, Nav, Sidebar, Tip } from 'grommet';
import { Logout, Schedules, Group, ContactInfo, Analytics } from 'grommet-icons';

const MenuButton = (
  props: ButtonProps & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'color'>
) => {
  let { label, ...rest } = props;
  if (label) {
    return (
      <Tip dropProps={{ align: { left: 'right' } }} content={label}>
        <Button hoverIndicator style={{ borderRadius: '10px' }} {...rest} />
      </Tip>
    );
  } else {
    return <Button hoverIndicator style={{ borderRadius: '10px' }} {...rest} />;
  }
};

const SidebarFooter = () => {
  const { logout } = useAuth0();
  return (
    <Nav gap='small'>
      <MenuButton onClick={() => logout()} label='Sair' icon={<Logout />} />
    </Nav>
  );
};

const MainNavigation = () => (
  <Nav gap='small' align='center'>
    <MenuButton label='Agenda' icon={<Schedules />} />
    <MenuButton label='Equipe' icon={<Group />} />
    <MenuButton label='Clientes' icon={<ContactInfo />} />
    <MenuButton label='Relatórios' icon={<Analytics />} />
    <Box pad='small' border={{ color: 'white', side: 'bottom' }} />
  </Nav>
);

export const SidebarIcons = () => (
  <Box direction='row' margin={{ horizontal: 'xsmall', vertical: 'small' }}>
    <Sidebar round border={{ color: 'brand' }} align='center' alignContent='center' justify='start' footer={<SidebarFooter />}>
      <MainNavigation />
    </Sidebar>
  </Box>
);

export default SidebarIcons;
