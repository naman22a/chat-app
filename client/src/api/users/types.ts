interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
}

export type User = Omit<IUser, 'password'>;
