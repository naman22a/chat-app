import { Message } from '@/api/types';
import { User } from '@/api/users/types';

export interface ServerToClientEvents {
    joined: (payload: Omit<User, 'password'>) => void;
    receiveMessage: (msgText: Message) => void;
    typingResponse: (payload: { roomName: string; isTyping: boolean }) => void;
}

export interface ClientToServerEvents {
    join: (
        payload: { roomName: string },
        cb?: () => void,
    ) => Omit<User, 'password'>;
    sendMessage: (
        payload: { message: string; roomName: string },
        cb?: (newMsg: Message) => void,
    ) => string;
    messages: (
        payload: { roomId: number },
        cb?: (data: Message[]) => void,
    ) => Message[];
    typing: (
        payload: { name: string; isTyping: boolean },
        cb?: () => void,
    ) => void;
}
