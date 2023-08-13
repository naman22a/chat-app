import React, { useEffect, useState } from 'react';
import * as api from '@/api';
import { Message } from '@/api/types';
import { Room } from '@/api/rooms/types';
import { formatError } from '@/utils';
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

const socket = useSocket('chat');

const Chat: React.FC<Props> = (props) => {
    const { room } = props;
    const {
        data: me,
        isLoading,
        isError,
    } = useQuery(['users', 'me'], api.users.me);
    const [msgs, setMsgs] = useState<Message[] | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        socket.on('receiveMessage', (newMsg: Message) => {
            setMsgs((prev) => [...prev!, newMsg]);
        });

        // it also auto joins the user
        socket.emit('messages', { roomId: room.id }, (data: Message[]) => {
            setMsgs(data);
        });
    }, []);

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message) {
            setError('message is required');
            return;
        }
        socket.emit(
            'sendMessage',
            { message, roomName: room.name },
            (newMsg: Message) => {
                setMsgs((prev) => [...prev!, newMsg]);
            },
        );

        setMessage('');
    };

    if (!msgs || isLoading || isError || !me) {
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
                                msg?.sender?.id === me!.id && 'justify-end',
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
                                            msg?.sender?.id === me!.id &&
                                                'text-primary',
                                        )}
                                    >
                                        [{msg?.sender?.username}]
                                    </span>
                                    : {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </ReactScrollableFeed>
            </div>
            <div>
                <form
                    className="flex items-center mt-5"
                    onSubmit={(e) => handleSendMessage(e)}
                >
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Enter a message"
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center h-full bg-accent p-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 ml-1"
                    >
                        <RiSendPlaneFill className="h-5 w-5" />
                    </button>
                </form>
                {error && (
                    <p className="text-error text-xs  font-semibold mt-1">
                        {formatError(error)}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Chat;
