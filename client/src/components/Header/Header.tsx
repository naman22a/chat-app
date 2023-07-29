import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="navbar bg-base-200 flex items-center justify-between px-5 lg:px-16 py-5 mb-5">
            <Link href="/">
                <h3 className="btn btn-ghost text-xl">Chat App</h3>
            </Link>
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
        </header>
    );
};

export default Header;
