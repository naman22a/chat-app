import React from 'react';
import * as api from '@/api';
import { Button } from '@/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify, showError } from '@/utils';
import { useRouter } from 'next/router';

const LogoutButton: React.FC = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { mutateAsync: logout, isLoading } = useMutation(
        ['auth', 'logout'],
        api.auth.logout,
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users', 'me']);
            },
        },
    );

    const handleLogout = async () => {
        try {
            const res = await logout();

            if (res.ok && !res.errors) {
                notify('Logged out');
                router.push('/login');
            } else {
                showError();
            }
        } catch (error) {
            console.error(error);
            showError();
        }
    };

    return (
        <Button
            textClassName="text-base"
            isLoading={isLoading}
            onClick={() => handleLogout()}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
