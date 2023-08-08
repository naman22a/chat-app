import React, { useEffect, useState } from 'react';
import * as api from '@/api';
import { Message } from '@/api/types';
import { Room } from '@/api/rooms/types';
import { Spinner } from '@/components';
import { useSocket } from '@/lib/socket';
import { useQuery } from '@tanstack/react-query';
import { twMerge } from 'tailwind-merge';
import { RiSendPlaneFill } from 'react-icons/ri';
import ReactScrollableFeed from 'react-scrollable-feed';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface Props {
    room: Room;
}

const Chat: React.FC<Props> = (props) => {
    const { room } = props;
    const socket = useSocket('messages');
    const { data: me } = useQuery(['users', 'me'], api.users.me);
    const [msgs, setMsgs] = useState<Message[] | null>(null);

    useEffect(() => {
        socket.emit('messages', room.id, (data: Message[]) => {
            console.log(data);
            setMsgs(data);
        });
    }, []);

    if (!msgs) {
        return (
            <div>
                <h2 className="mb-10 text-xl font-semibold">
                    Loading Messages...
                </h2>
                <Spinner type="spinner" />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-between h-3/4">
            <div className="overflow-y-scroll h-full p-4">
                <ReactScrollableFeed>
                    {msgs.map((msg) => (
                        <div
                            key={msg.id}
                            className={twMerge(
                                'flex items-center text-lg my-5 w-full',
                                msg.sender.id === me!.id && 'justify-end',
                            )}
                        >
                            <div className="flex flex-col">
                                <span className="text-xs text-right">
                                    {dayjs(msg.createdAt).fromNow()}
                                </span>
                                <div className="flex items-center">
                                    <span
                                        className={twMerge(
                                            'text-secondary',
                                            msg.sender.id === me!.id &&
                                                'text-primary',
                                        )}
                                    >
                                        [{msg.sender.username}]
                                    </span>
                                    : {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </ReactScrollableFeed>
            </div>
            <div className="join flex items-center mt-5">
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Enter a message"
                />
                <div className="join-item flex items-center justify-center h-full bg-accent px-5">
                    <RiSendPlaneFill />
                </div>
            </div>
        </div>
    );
};

export default Chat;
