import { Message, User } from '@prisma/client';

export interface ServerToClientEvents {
    newUserJoined: (payload: Omit<User, 'password'>) => void;
    receiveMessage: (msg: Message) => void;
}
