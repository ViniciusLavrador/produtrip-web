import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Button, LoadingAnimation, Typography } from 'components';
import Layout from 'components/Layout/Layout';
import { CheckOutlineIcon, MenuAlt3OutlineIcon } from 'public/icons/outline';
import { useSocket } from 'components/SocketIO';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useApi } from 'hooks';
import { toast } from 'react-toastify';
import { Message, Room } from 'components/Chat/types';
import withRole from 'helpers/withRole';
import Chat from 'components/Chat/Chat';

const ChatPage = () => {
  // Establish Socket Connection
  //const { socket } = useSocket();

  // Get Receiver
  const { query } = useRouter();
  let id = Buffer.from(query['id'] as string, 'base64').toString();
  let { data: receiver, isLoading, error, revalidate } = useApi(`auth/users/${id}`);

  // Internal State
  const [room, setRoom] = useState<Room>();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Get User
  const { user } = useAuth0();

  // Join Room
  // useEffect(() => {
  //   if (user && receiver) {
  //     socket.emit('join-room', { user1: user.sub, user2: receiver.user_id }, (room: Room) => {
  //       setRoom(room);
  //     });
  //   }
  // }, [user, receiver]);

  // Subscribe To Messages
  // useEffect(() => {
  //   if (room) {
  //     socket.on('received-message', (message: Message) => {
  //       console.log('received message', message);
  //     });
  //   }
  // }, [room]);

  // Send Message
  const updateCurrentMessage: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setCurrentMessage(event.target.value);
  };
  const sendMessage = () => {
    // if (currentMessage !== '' && room && user) {
    //   socket.emit('user-sent-message', { room: room, content: currentMessage, sender: user });
    // }
    if (currentMessage !== '' && user) {
      setMessages([...messages, { created_at: new Date(Date.now()), content: currentMessage, participant: { user: user } }]);
      setCurrentMessage('');
    }
  };

  // THIS SECTION IS HERE IN ORDER TO SIMULATE ANSWERS WHILE THE WS ISNT PROPERLY CONFIGURED AND IMPLEMENTED
  const simulateAnswer = () => {
    // if (currentMessage !== '' && room && user) {
    //   socket.emit('user-sent-message', { room: room, content: currentMessage, sender: user });
    // }
    if (receiver) {
      setMessages([
        ...messages,
        {
          created_at: new Date(Date.now()),
          content: 'Tudo sim ! Acabei de sair da minha primeiva visita, tudo certo !! Subi o formulário fazem uns 5 minutos.',
          participant: { user: receiver },
        },
      ]);
      setCurrentMessage('');
    }
  };

  const simulateAnswerOnShiftEnter = (e: KeyboardEvent) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      simulateAnswer();
    }
  };
  // SIMULATION END

  // Render
  if (error) {
    toast.error(error);
    return <LoadingAnimation size='2xl' />;
  }

  if (isLoading) {
    return <LoadingAnimation size='2xl' />;
  }

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: 'Chat' },
          list: [{ title: receiver.name, href: `/team/${Buffer.from(user.sub).toString('base64')}` }],
        }}
      />
      <Layout.Content>
        <Chat>
          <Chat.Panel messages={messages} />
          <Chat.ActionRow
            currentMessage={currentMessage}
            updateCurrentMessage={updateCurrentMessage}
            simulateAnswerOnShiftEnter={simulateAnswerOnShiftEnter}
          >
            <>
              <Button primary onClick={sendMessage}>
                Enviar
              </Button>
            </>
          </Chat.ActionRow>
        </Chat>
      </Layout.Content>
    </Layout>
  );
};

export default withRole(ChatPage);
