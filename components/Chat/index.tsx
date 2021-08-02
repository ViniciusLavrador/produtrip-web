import { useAuth0 } from '@auth0/auth0-react';
import { MessageProps } from 'components/Chat/Message';
import ChatPanel from './ChatPanel';

export interface ChatProps {
  receiver: any;
  receiveMessage(): MessageProps[];
}

export const Chat = ({ receiver }: ChatProps) => {
  const { user: sender } = useAuth0();

  return (
    <ChatPanel
      messages={[
        { content: 'Mensagem Enviada', sender, receiver, timestamp: new Date(Date.now()) },
        { content: 'Mensagem Recebida', sender: receiver, receiver: sender, timestamp: new Date(Date.now()) },
      ]}
      sender={sender}
      receiver={receiver}
    />
  );
};

export default Chat;
