import React from 'react';
import Link from 'next/link';
import * as api from '@/api';
import { useQuery } from '@tanstack/react-query';
import LogoutButton from './LogoutButton/LogoutButton';

const Header: React.FC = () => {
    const { data, isLoading, isError } = useQuery(
        ['users', 'me'],
        api.users.me,
    );
    return (
        <header className="navbar bg-base-200 flex items-center justify-between px-5 lg:px-16 py-5 mb-5">
            <Link href="/">
                <h3 className="btn btn-ghost text-xl">Chat App</h3>
            </Link>
            {isLoading || isError ? (
                <nav className="flex items-center gap-4">
                    <Link
                        className="font-semibold text-base link link-hover"
                        href="/login"
                    >
                        Login
                    </Link>
                    <Link
                        className="font-semibold text-base link link-hover"
                        href="/register"
                    >
                        Register
                    </Link>
                </nav>
            ) : (
                <div className="flex items-center gap-4">
                    <h4 className="text-xl font-semibold">{data.username}</h4>
                    <LogoutButton />
                </div>
            )}
        </header>
    );
};

export default Header;
