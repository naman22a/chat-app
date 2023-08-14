import { io, Socket } from 'socket.io-client';

export const useSocket = (): Socket => {
    return io(`${process.env.NEXT_PUBLIC_API_ENDPOINT}`, {
        withCredentials: true,
    });
};
