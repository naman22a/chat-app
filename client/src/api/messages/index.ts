import API from '..';
import { User } from '../users/types';
import { Message } from './types';

type MessagWith = Message & { sender: User };

export const getMessages = async (id: number): Promise<MessagWith[]> => {
    const res = await API.get(`/messages/room/${id}`);
    return res.data;
};
