import { Button } from 'components';
import Layout from 'components/Layout/Layout';
import { CheckOutlineIcon, MenuAlt3OutlineIcon } from 'public/icons/outline';

const UserSearchBar = () => {
  return (
    <input type='text' placeholder='Buscar' className='appearance-none focus:outline-none py-2 px-3 rounded border-2 w-full' />
  );
};

const SentMessage = ({ message }: { message: string }) => {
  return <div className='rounded-lg w-max bg-yellow-200 p-4 border-2 justify-self-end'>{message}</div>;
};

const ReceivedMessage = ({ message }: { message: string }) => {
  return <div className='rounded-lg w-max bg-white p-4 border-2'>{message}</div>;
};

const MessageComponent = ({ message, user, sent }: { message: string; user?: any; sent?: boolean }) => {
  return sent ? <SentMessage message={message} /> : <ReceivedMessage message={message} />;
};

const ChatPanel = () => {
  return (
    <div className='rounded bg-white w-full h-full flex flex-col gap-3 overflow-scroll py-2 px-3 border-2'>
      <MessageComponent message='Mensagem Enviada' sent />
      <MessageComponent message='Mensagem Recebida' />
    </div>
  );
};

const ChatInput = () => {
  return (
    <div className='rounded bg-white w-full py-2 px-3 border-2 flex flex-row gap-3 items-center'>
      <textarea className='appearance-none focus:outline-none py-2 px-3 rounded border-2 w-11/12' />
      <Button primary onClick={() => console.log('send')} className='!p-2'>
        <CheckOutlineIcon className='w-6 h-6' />
      </Button>
      <MenuAlt3OutlineIcon className='w-6 h-6 cursor-pointer hover:text-yellow-500' />
    </div>
  );
};

export const ChatPage = () => {
  return (
    <Layout>
      <Layout.Header breadcrumb={{ main: { title: 'Mensagens' } }} />
      <Layout.Content>
        <div className='grid grid-cols-4 gap-5 h-[400px]'>
          <div className='col-span-1 h-full'>
            <UserSearchBar />
          </div>
          <div className='col-span-3 h-full'>
            <ChatPanel />
            <br />
            <hr />
            <br />
            <ChatInput />
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default ChatPage;
