export interface MessageProps {
  content: string;
  user?: any;
  sent?: boolean;
  timestamp: Date;
}

const SentMessage = ({ content, user, timestamp, sent }: MessageProps) => {};
