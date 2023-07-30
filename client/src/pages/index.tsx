import { NextPage } from 'next';
import { Button, IsAuth } from '@/components';
import Link from 'next/link';

const Index: NextPage = () => {
    return (
        <div>
            <Link href="/create-room">
                <Button>Create a room</Button>
            </Link>
        </div>
    );
};

export default IsAuth(Index);
