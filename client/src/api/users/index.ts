import API from '..';
import { User } from './types';

export const getUsers = async (): Promise<User[]> => {
    const res = await API.get('/users');
    return res.data;
};

export const me = async (): Promise<User> => {
    const res = await API.get('/users/me');
    return res.data;
};
