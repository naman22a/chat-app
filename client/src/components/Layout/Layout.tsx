import React from 'react';
import { Header } from '@/components';
import { Toaster } from 'react-hot-toast';

interface Props {
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="px-5 lg:px-20 py-5">{children}</div>
            <Toaster
                toastOptions={{
                    style: {
                        backgroundColor: '#030712',
                        color: 'white',
                        textAlign: 'center',
                    },
                }}
            />
        </div>
    );
};

export default Layout;
