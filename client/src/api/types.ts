import { User } from './users/types';

export interface FieldError {
    field: string;
    message: string;
}

export interface OkResponse {
    ok: boolean;
    errors?: FieldError[];
}

export interface Message {
    id: number;
    text: string;
    createdAt: string;
    updatedAt: string;
    roomId: number;
    senderId: number;
    sender: User;
}
