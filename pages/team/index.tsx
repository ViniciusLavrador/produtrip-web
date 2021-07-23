import { useRef, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { LoadingAnimation, Button, UserCard, Tooltip } from 'components';
import { useApi, useThemeMode } from 'hooks';
import { SumOutlineIcon } from 'public/icons/outline';
import { toast } from 'react-toastify';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import cx from 'classnames';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { UserRemoveSolidIcon } from 'public/icons/solid';
import axios from 'axios';
import Layout from 'components/Layout/Layout';

const CONTEXT_MENU_ID = 'TeamPageContextMenu';
interface TeamPageContextMenuProps {}

export const TeamPageContextMenu = ({}: TeamPageContextMenuProps) => {
  const { currentMode } = useThemeMode();

  const iconClasses = cx('ml-4', 'w-4 h-4');
  const itemContainerClasses = cx('flex flex-row', 'justify-between items-center', 'w-full');

  return (
    <Menu id={CONTEXT_MENU_ID} theme={currentMode}>
      <Item>
        <div className={itemContainerClasses}>
          Adicionar Colaborador
          <SumOutlineIcon className={iconClasses} />
        </div>
      </Item>
    </Menu>
  );
};

interface TeamListProps {
  users?: any[];
  userSelection: string[];
  toggleUserSelection(id: string): void;
  removeUser?(id: string): Promise<void>;
}

const TeamList = ({ users, userSelection, toggleUserSelection, removeUser }: TeamListProps) => {
  return (
    <div className='container grid grid-cols-1 md:grid-cols-4 gap-5'>
      {users &&
        users.map((user: any) => (
          <UserCard
            removeUser={() => removeUser(user.user_id)}
            user={user}
            key={user.user_id}
            variant='row'
            scaleOnHover
            selected={userSelection.includes(user.user_id)}
            onClick={() => toggleUserSelection(user.user_id)}
          />
        ))}
    </div>
  );
};

export interface TeamProps {}

export const Team = ({}: TeamProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const { show } = useContextMenu({ id: CONTEXT_MENU_ID });
  const [userSelection, setUserSelection] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { data, error, isLoading, revalidate } = useApi(`auth/users`);

  const pushToSelection = (id: string) => setUserSelection([...userSelection, id]);
  const removeFromSelection = (id: string) => setUserSelection(userSelection.filter((value) => value !== id));

  const toggleUserSelection = (id: string) => {
    if (userSelection.includes(id)) {
      removeFromSelection(id);
    } else {
      pushToSelection(id);
    }
  };

  const removeUser = async (id: string) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently({
      audience: process.env.NEXT_PUBLIC_API_AUTH0_AUDIENCE,
    });

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/auth/users/${id}`, {
        headers: { Authentication: `Bearer ${accessToken}` },
      });
      removeFromSelection(id);

      toast.success('Usuário Removido com Sucesso');
      await revalidate();
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao Remover Colaborador. Tente Novamente.');
    } finally {
      setLoading(false);
    }
  };

  const rootClasses = cx('h-full w-full', 'select-none');
  const FABRowClasses = cx('fixed bottom-10 right-10 flex flex-row gap-5');
  const iconClasses = cx('h-6 w-6');

  const animatedButtonVariants: Variants = {
    open: { scale: 1 },
    close: { scale: 0 },
  };

  /** API DATA */

  if (isLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  if (error) {
    console.error(error);
    toast.error('Tivemos um erro. 😓 Por Favor, tente novamente.', { toastId: 'apiError' });
  }

  const removeSelected = async () => {
    Promise.all(
      userSelection.map(async (id) => {
        return removeUser(id);
      })
    );
  };

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: 'Colaboradores' },
        }}
      />
      <Layout.Content>
        <div className={rootClasses} onContextMenu={show}>
          {data && (
            <TeamList
              users={data}
              toggleUserSelection={toggleUserSelection}
              userSelection={userSelection}
              removeUser={removeUser}
            />
          )}
          <div className={FABRowClasses}>
            <motion.div variants={animatedButtonVariants} animate={userSelection.length > 0 ? 'open' : 'close'}>
              <Button primary onClick={removeSelected} rounded>
                <UserRemoveSolidIcon className={iconClasses} />
              </Button>
            </motion.div>

            <Tooltip content='Adicionar Colaborador' placement='top'>
              <Button primary href='/team/new' rounded>
                <SumOutlineIcon className={iconClasses} />
              </Button>
            </Tooltip>
          </div>
          <TeamPageContextMenu />
        </div>
        {loading && (
          <div className='fixed bottom-20 right-10'>
            <LoadingAnimation size='xs' />
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default withAuthenticationRequired(Team);
