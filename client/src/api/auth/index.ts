import API from '..';
import { LoginDto, RegisterDto } from './types';
import { OkResponse } from '../types';
import axios from 'axios';

export const register = async (data: RegisterDto): Promise<OkResponse> => {
    try {
        const res = await API.post('/auth/register', data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        throw new Error('Something went wrong');
    }
};

export const login = async (data: LoginDto): Promise<OkResponse> => {
    try {
        const res = await API.post('/auth/login', data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        throw new Error('Something went wrong');
    }
};

export const logout = async (): Promise<OkResponse> => {
    const res = await API.post('/auth/logout');
    return res.data;
};
