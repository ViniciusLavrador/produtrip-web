import { MessageProps } from 'components/Chat/Message';

export interface ChatPanelProps {
  messages: MessageProps[];
}

export const ChatPanel = ({ messages }: ChatPanelProps) => {
  return (
    <div className='rounded bg-gray-800 w-full h-full flex flex-col gap-3 overflow-scroll p-5 border-2'>
      {messages.map((message) => {})}
    </div>
  );
};
export default ChatPanel;
