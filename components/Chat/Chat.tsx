import { useAuth0 } from '@auth0/auth0-react';
import { Avatar } from 'components/Avatar';
import { Button } from 'components/Button';
import { Typography } from 'components/Typography';
import { ChangeEventHandler, MouseEventHandler } from 'react';
import { Message } from './types';

interface MessageComponentProps {
  message: Message;
  user: any;
}

const MessageComponent = ({ message, user }: MessageComponentProps) => {
  let sent = message.participant.user.sub === user.sub;

  return (
    <div className={`flex flex-row gap-2 ${sent ? 'justify-end' : 'justify-start'}`}>
      {!sent && <Avatar src={message.participant.user.picture} size='xs' alt='avatar' />}
      <div
        className={`w-max max-w-[450px] whitespace-normal flex-wrap ${
          sent ? 'text-right bg-yellow-500' : 'text-left bg-gray-500'
        } px-4 py-2 rounded`}
      >
        <Typography variant='p' className='whitespace-normal text-white'>
          {message.content}
        </Typography>
        <div className={`flex flex-col ${sent ? 'justify-end' : 'justify-start'} mt-2`}>
          <Typography variant='span' className='text-xs text-white'>
            {message.participant.user.name}
          </Typography>
          <Typography variant='span' className='text-xs text-white'>
            {new Date(message.created_at).toLocaleTimeString()}
          </Typography>
        </div>
      </div>

      {sent && <Avatar src={user.picture} size='xs' alt='avatar' />}
    </div>
  );
};

export interface ChatPanelProps {
  messages: Message[];
}

const ChatPanel = ({ messages }: ChatPanelProps) => {
  const { user } = useAuth0();

  return (
    <div className='w-full rounded h-[450px] relative overflow-scroll bg-white dark:bg-gray-700 border-2 shadow dark:border-gray-500 px-4 py-2 flex flex-col gap-5'>
      {messages.map((message) => {
        return <MessageComponent key={message.created_at.getTime()} message={message} user={user} />;
      })}
    </div>
  );
};

export interface ChatActionRowProps {
  currentMessage: string;
  updateCurrentMessage: ChangeEventHandler<HTMLTextAreaElement>;
  children?: React.ReactNode;
  simulateAnswerOnShiftEnter?: any;
}

const ChatActionRow = ({ currentMessage, updateCurrentMessage, children, simulateAnswerOnShiftEnter }: ChatActionRowProps) => {
  return (
    <>
      <div className='w-full flex flex-row gap-5 mt-5 items-center'>
        <textarea
          className='appearance-none focus:outline-none py-2 px-3 rounded border-2 w-full shadow dark:border-gray-500 dark:bg-gray-700 dark:text-white'
          rows={3}
          value={currentMessage}
          onChange={updateCurrentMessage}
          onKeyDown={simulateAnswerOnShiftEnter}
        />
        {children}
      </div>
    </>
  );
};

export interface ChatProps {
  children: React.ReactNode;
}

export const Chat = ({ children }: ChatProps) => {
  return <>{children}</>;
};

Chat.ActionRow = ChatActionRow;
Chat.Panel = ChatPanel;

export default Chat;
