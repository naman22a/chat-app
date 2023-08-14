import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as api from '@/api';
import { useQuery } from '@tanstack/react-query';
import { Chat, IsAuth, Spinner } from '@/components';

const RoomPage: NextPage = () => {
    const router = useRouter();
    const name = router.query.name as string;
    const {
        data: room,
        isLoading,
        isError,
    } = useQuery(['rooms', name], () => api.rooms.getByName(name));

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
