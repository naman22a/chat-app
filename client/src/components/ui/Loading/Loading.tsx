import React from 'react';
import Spinner from './Spinner/Spinner';

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Spinner type="dots" size="lg" />
        </div>
    );
};

export default Loading;
