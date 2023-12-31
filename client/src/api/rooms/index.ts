import API from '..';
import { User } from '../users/types';
import { Room as IRoom } from './types';

type Room = IRoom & {
    owner: User;
    participants: User[];
};

export const getById = async (id: number): Promise<Room> => {
    const res = await API.get(`/rooms/id/${id}`);
    return res.data;
};

export const getByName = async (name: string): Promise<Room> => {
    const res = await API.get(`/rooms/name/${name}`);
    return res.data;
};

export const my = async (): Promise<Room[]> => {
    const res = await API.get('/rooms/my');
    return res.data;
};

export const joined = async (): Promise<Room[]> => {
    const res = await API.get('/rooms/joined');
    return res.data;
};

export const create = async (name: string): Promise<Room> => {
    const res = await API.post('/rooms/create', { name });
    return res.data;
};
