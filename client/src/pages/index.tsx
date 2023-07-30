import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import * as api from '@/api';
import { Loading } from '@/components';
import Image from 'next/image';

const Index: NextPage = () => {
    const {
        data: users,
        isLoading,
        isError,
    } = useQuery(['users', 'getUsers'], api.users.getUsers);

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-4xl font-semibold mb-5">List of users</h1>
            {users.map((user) => (
                <div key={user.id}>
                    <div className="avatar online">
                        <div className="w-32 rounded-full bg-gray-50">
                            <Image
                                src={user.avatar}
                                alt={user.username}
                                height={100}
                                width={100}
                            />
                        </div>
                    </div>
                    <h3>Username: {user.username}</h3>
                    <h3>Email: {user.email}</h3>
                </div>
            ))}
        </div>
    );
};

export default Index;
