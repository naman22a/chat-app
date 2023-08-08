import { Message } from '@/api/types';
import { User } from '@/api/users/types';

export interface ServerToClientEvents {
    newUserJoined: (payload: Omit<User, 'password'>) => void;
    receiveMessage: (msgText: string) => void;
}

export interface ClientToServerEvents {
    join: (roomName: string) => Omit<User, 'password'>;
    sendMessage: (message: string, roomId: number) => string;
    messages: (roomId: number) => Message[];
}
