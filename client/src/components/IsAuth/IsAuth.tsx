import React from 'react';
import * as api from '@/api';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '..';

function IsAuth<T>(Component: React.ComponentType<T>) {
    return (props: T) => {
        // make a api call to check if user is authenticated
        const { data, isLoading, isError } = useQuery(
            ['users', 'me'],
            api.users.me,
        );
        const router = useRouter();

        if (isLoading) {
            return <Loading />;
        }

        if (isError || !data) {
            router.push('/login');
        }

        return (
            <>
                <Component {...props!} />
            </>
        );
    };
}

export default IsAuth;
