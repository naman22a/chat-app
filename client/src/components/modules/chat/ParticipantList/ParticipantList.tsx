import React from 'react';
import Image from 'next/image';
import { Room } from '@/api/rooms/types';
import { User } from '@/api/users/types';
import { twMerge } from 'tailwind-merge';

interface Props {
    room: Room & { owner: User; participants: User[] };
}

const ParticipantList: React.FC<Props> = (props) => {
    const { room } = props;
    // TODO: implement this
    let isOnline = true;

    return (
        <div className="hidden lg:block lg:w-1/4 px-6">
            <h4 className="text-xl font-semibold">Participants List</h4>
            <div>
                {room.participants.map((participant) => (
                    <div
                        key={participant.id}
                        className="flex items-center gap-5 my-5"
                    >
                        <div
                            className={twMerge(
                                'h-20 w-20 bg-slate-900 grid place-items-center rounded-full avatar',
                                isOnline && 'online',
                            )}
                        >
                            <Image
                                src={participant.avatar}
                                alt={participant.username}
                                height={100}
                                width={100}
                            />
                        </div>
                        <h5 className="font-semibold text-lg">
                            {participant.username}
                        </h5>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipantList;
