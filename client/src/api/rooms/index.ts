import API from '..';
import { User } from '../users/types';
import { Room } from './types';

export const create = async (
    name: string,
): Promise<
    Room & {
        owner: User;
        participants: User[];
    }
> => {
    const res = await API.post('/rooms/create', { name });
    return res.data;
};
