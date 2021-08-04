export enum RoomTypeEnum {
  GROUP = 'GROUP',
  SIMPLE = 'SIMPLE',
}

export interface Participant {
  id?: string;
  user?: any;
  createdAt?: Date;
  updatedAt?: Date;
  room?: Room;
  messages?: Message[];
}

export interface Message {
  id?: string;
  content?: string;
  created_at?: Date;
  updated_at?: Date;
  room?: Room;
  participant?: Participant;
  reply_to?: Message;
  replies?: Message;
}

export interface Room {
  id?: string;
  name?: string;
  type?: RoomTypeEnum;
  createdAt?: Date;
  updatedAt?: Date;
  messages?: Message[];
  participants?: Participant[];
}
