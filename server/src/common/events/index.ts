import { Message, User } from '@prisma/client';

export interface ServerToClientEvents {
    joined: (payload: Omit<User, 'password'>) => void;
    receiveMessage: (msg: Message) => void;
}
