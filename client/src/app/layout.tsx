import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chat App',
    description:
        'A Chat app project create by Naman Arora using Web sockets technology'
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
