import { Message } from '@/api/types';
import { User } from '@/api/users/types';

export interface ServerToClientEvents {
    joined: (payload: Omit<User, 'password'>) => void;
    receiveMessage: (msgText: Message) => void;
}

export interface ClientToServerEvents {
    join: (roomName: string) => Omit<User, 'password'>;
    sendMessage: (message: string, roomId: number) => string;
    messages: (roomId: number) => Message[];
}
