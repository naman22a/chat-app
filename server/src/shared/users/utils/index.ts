import { User } from '@prisma/client';

export const excludeUserDetails = (user: User): Omit<User, 'password'> => {
    const { password, ...rest } = user;
    return rest;
};
