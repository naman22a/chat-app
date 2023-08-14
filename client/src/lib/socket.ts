import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents } from '../constants';

export const useSocket = (): Socket<ServerToClientEvents, any> => {
    return io(`${process.env.NEXT_PUBLIC_API_ENDPOINT}`, {
        withCredentials: true,
    });
};
