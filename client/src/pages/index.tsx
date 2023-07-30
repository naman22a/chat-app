import { NextPage } from 'next';
import Link from 'next/link';
import { Button, IsAuth, JoinedRooms, MyRooms } from '@/components';

const Index: NextPage = () => {
    return (
        <div className="flex flex-col gap-5">
            <MyRooms />
            <Link href="/create-room">
                <Button>Create a room</Button>
            </Link>
            <JoinedRooms />
        </div>
    );
};

export default IsAuth(Index);
