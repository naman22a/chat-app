import { io, Socket } from 'socket.io-client';

export const useSocket = (namespace: string): Socket => {
    return io(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${namespace}`, {
        withCredentials: true,
    });
};
