import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as api from '@/api';
import { User } from '@/api/users/types';
import { useSocket } from '@/lib/socket';
import { useQuery } from '@tanstack/react-query';
import { Chat, IsAuth, Spinner } from '@/components';
import { toast } from 'react-hot-toast';

const socket = useSocket();

const RoomPage: NextPage = () => {
    const router = useRouter();
    const name = router.query.name as string;
    const {
        data: room,
        isLoading,
        isError,
    } = useQuery(['rooms', name], () => api.rooms.getByName(name));

    useEffect(() => {
        // ! FIX IT: it is not working idk why 😭
        socket.on('joined', (user: User) => {
            console.log(user);
            toast.success(`${user.username} joined the chat`);
        });
    }, [socket, room]);

    if (isLoading || isError) {
        return (
            <div className="flex items-center justify-center pt-52">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="h-full">
            <h1 className="text-4xl font-semibold mb-5">
                Room: <span className="text-accent">{name}</span>
            </h1>
            <Chat room={room} />
        </div>
    );
};

export default IsAuth(RoomPage);
