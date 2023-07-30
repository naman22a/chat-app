import { User } from '@prisma/client';

export interface ServerToClientEvents {
    newUserJoined: (payload: User) => void;
}
