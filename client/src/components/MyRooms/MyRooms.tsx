import React from 'react';
import * as api from '@/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const MyRooms: React.FC = () => {
    const {
        data: rooms,
        isLoading,
        isError,
    } = useQuery(['rooms', 'my'], api.rooms.my);

    return (
        <div>
            <h2 className="text-3xl font-semibold mb-5">My Rooms 🏡</h2>
            {isLoading || isError || !rooms ? (
                <span className="loading loading-spinner text-accent w-20"></span>
            ) : (
                <div>
                    {rooms.length > 0 ? (
                        <ol>
                            {rooms.map((room, index) => (
                                <li key={room.id} className="text-lg">
                                    <Link href={`/rooms/${room.name}`}>
                                        {index + 1}.{' '}
                                        <span className="link link-hover link-accent">
                                            {room.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <span>No rooms found.</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyRooms;
