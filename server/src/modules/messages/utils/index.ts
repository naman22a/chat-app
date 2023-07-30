import { Message, User } from '@prisma/client';
import { excludeUserDetails } from '../../../shared';

export const excludeMessageDetails = (msg: Message & { sender: User }) => {
    const { sender, ...rest } = msg;

    return {
        ...rest,
        sender: excludeUserDetails(sender),
    };
};
