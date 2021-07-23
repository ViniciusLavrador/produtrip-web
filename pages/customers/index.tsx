import { useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { LoadingAnimation, Button, Tooltip } from 'components';
import { useApi, useThemeMode } from 'hooks';
import { SumOutlineIcon } from 'public/icons/outline';
import { toast } from 'react-toastify';
import { Menu, Item, useContextMenu } from 'react-contexify';
import cx from 'classnames';
import { motion, Variants } from 'framer-motion';
import { UserRemoveSolidIcon } from 'public/icons/solid';
import axios from 'axios';
import CustomerCard from 'components/Card/CustomerCard';
import Link from 'next/link';
import Layout from 'components/Layout/Layout';

const CONTEXT_MENU_ID = 'CustomerPageContextMenu';
interface CustomersPageContextMenuProps {}

export const CustomersPageContextMenu = ({}: CustomersPageContextMenuProps) => {
  const { currentMode } = useThemeMode();

  const iconClasses = cx('ml-4', 'w-4 h-4');
  const itemContainerClasses = cx('flex flex-row', 'justify-between items-center', 'w-full');

  return (
    <Menu id={CONTEXT_MENU_ID} theme={currentMode}>
      <Item>
        <Link href='/customers/new'>
          <div className={itemContainerClasses}>
            Adicionar Cliente
            <SumOutlineIcon className={iconClasses} />
          </div>
        </Link>
      </Item>
    </Menu>
  );
};

interface CustomersListProps {
  customers?: any[];
  customerSelection: string[];
  toggleCustomerSelection(id: string): void;
  removeCustomer?(id: string): Promise<void>;
}

const CustomersList = ({ customers, customerSelection, toggleCustomerSelection, removeCustomer }: CustomersListProps) => {
  return (
    <div className='container grid grid-cols-1 md:grid-cols-4 gap-5'>
      {customers &&
        customers.map((customer: any) => (
          <CustomerCard
            removeCustomer={() => removeCustomer(customer.id)}
            customer={customer}
            key={customer.id}
            variant='row'
            scaleOnHover
            selected={customerSelection.includes(customer.id)}
            onClick={() => toggleCustomerSelection(customer.id)}
          />
        ))}
    </div>
  );
};

export interface CustomersProps {}

export const Customers = ({}: CustomersProps) => {
  const rootClasses = cx('h-full w-full', 'select-none');
  const FABRowClasses = cx('fixed bottom-10 right-10 flex flex-row gap-5');
  const iconClasses = cx('h-6 w-6');

  const { getAccessTokenSilently } = useAuth0();
  const { show } = useContextMenu({ id: CONTEXT_MENU_ID });
  const [customerSelection, setCustomerSelection] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { data, error, isLoading, revalidate } = useApi(`companies`);

  const pushToSelection = (id: string) => setCustomerSelection([...customerSelection, id]);
  const removeFromSelection = (id: string) => setCustomerSelection(customerSelection.filter((value) => value !== id));

  const toggleCustomerSelection = (id: string) => {
    if (customerSelection.includes(id)) {
      removeFromSelection(id);
    } else {
      pushToSelection(id);
    }
  };

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

  const removeCustomer = async (id: string) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently({
      audience: process.env.NEXT_PUBLIC_API_AUTH0_AUDIENCE,
    });

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/companies/${id}`, {
        headers: { Authentication: `Bearer ${accessToken}` },
      });
      removeFromSelection(id);

      toast.success('Cliente Removido com Sucesso');
      await revalidate();
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao Remover Cliente. Tente Novamente.');
    } finally {
      setLoading(false);
    }
  };

  const removeSelected = async () => {
    Promise.all(
      customerSelection.map(async (id) => {
        return removeCustomer(id);
      })
    );
  };

  console.log(data);

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: 'Clientes' },
        }}
      />
      <Layout.Content>
        <div className={rootClasses} onContextMenu={show}>
          {data && (
            <>
              <CustomersList
                customers={data}
                toggleCustomerSelection={toggleCustomerSelection}
                customerSelection={customerSelection}
                removeCustomer={removeCustomer}
              />
            </>
          )}
          <Layout.FABRow>
            <div className={FABRowClasses}>
              <motion.div variants={animatedButtonVariants} animate={customerSelection.length > 0 ? 'open' : 'close'}>
                <Button primary onClick={removeSelected} rounded>
                  <UserRemoveSolidIcon className={iconClasses} />
                </Button>
              </motion.div>

              <Tooltip content='Adicionar Colaborador' placement='top'>
                <Button primary href='/customers/new' rounded>
                  <SumOutlineIcon className={iconClasses} />
                </Button>
              </Tooltip>
            </div>
          </Layout.FABRow>

          <CustomersPageContextMenu />
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

export default withAuthenticationRequired(Customers);
