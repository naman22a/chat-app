import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <span className="loading loading-dots text-accent w-20"></span>;
        </div>
    );
};

export default Loading;
