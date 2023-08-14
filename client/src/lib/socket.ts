import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../constants';

export const useSocket = (): Socket<
    ServerToClientEvents,
    ClientToServerEvents
> => {
    return io(`${process.env.NEXT_PUBLIC_API_ENDPOINT}`, {
        withCredentials: true,
    });
};
