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

// export const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState('');

//   const { query } = useRouter();
//   let id = Buffer.from(query['id'] as string, 'base64').toString();

//   let { data: receiver, isLoading, error, revalidate } = useApi(`auth/users/${id}`);

//   if (error) {
//     toast.error(error);
//     return <LoadingAnimation size='2xl' />;
//   }

//   if (isLoading) {
//     return <LoadingAnimation size='2xl' />;
//   }

//   const { socket, subscribe, unsubscribe } = useSocket('message', (newMessage) => console.log(newMessage));
//   const { user } = useAuth0();

//   useEffect(() => {
//     socket.emit('handshake', { me: user });
//   }, []);

//   useEffect(() => {
//     subscribe();
//     return unsubscribe();
//   });

//   const updateCurrentMessage: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
//     setCurrentMessage(event.target.value);
//   };

//   const sendMessage = () => {
//     if (currentMessage !== '') {
//       socket.emit('message', currentMessage);
//       setCurrentMessage('');
//     }
//   };

//   const sendMessageOnEnter: any = (event: KeyboardEvent) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <Layout>
//       <Layout.Header
//         breadcrumb={{
//           main: { title: 'Chat', subtitle: receiver.name },
//         }}
//       />
//       <Layout.Content>
//         <div className='flex flex-col gap-5'>
//           <div className='w-full'>
//             <input type='text' />
//           </div>

//           <div className='w-full rounded h-[500px] bg-gray-100'></div>
//           <hr />
//           <div className='w-full flex flex-row gap-5 items-center'>
//             <textarea
//               className='w-full rounded px-3 py-2'
//               rows={3}
//               value={currentMessage}
//               onChange={updateCurrentMessage}
//               onKeyPress={sendMessageOnEnter}
//             />
//             <Button primary onClick={sendMessage}>
//               Enviar
//             </Button>
//           </div>
//         </div>
//       </Layout.Content>
//     </Layout>
//   );
// };

const ChatPage = () => {
  // Establish Socket Connection
  const { socket } = useSocket();

  // Get Receiver
  const { query } = useRouter();
  let id = Buffer.from(query['id'] as string, 'base64').toString();
  let { data: receiver, isLoading, error, revalidate } = useApi(`auth/users/${id}`);

  // Internal State
  const [room, setRoom] = useState<Room>();
  const [currentMessage, setCurrentMessage] = useState('');

  // Get User
  const { user } = useAuth0();

  // Join Room
  useEffect(() => {
    if (user && receiver) {
      socket.emit('join-room', { user1: user.sub, user2: receiver.user_id }, (room: Room) => {
        setRoom(room);
      });
    }
  }, [user, receiver]);

  // Subscribe To Messages
  useEffect(() => {
    if (room) {
      socket.on('received-message', (message: Message) => {
        console.log('received message', message);
      });
    }
  }, [room]);

  // Send Message
  const updateCurrentMessage: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setCurrentMessage(event.target.value);
  };
  const sendMessage = () => {
    if (currentMessage !== '' && room && user) {
      socket.emit('user-sent-message', { room: room, content: currentMessage, sender: user });
    }
  };

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
          main: { title: 'Chat', subtitle: receiver.name },
        }}
      />
      <Layout.Content>
        <div className='flex flex-col gap-5'>
          <div className='w-full rounded h-[450px] bg-gray-100'></div>
          <hr />
          <div className='w-full flex flex-row gap-5 items-center'>
            <textarea className='w-full rounded px-3 py-2' rows={3} value={currentMessage} onChange={updateCurrentMessage} />
            <Button primary onClick={sendMessage}>
              Enviar
            </Button>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default ChatPage;
