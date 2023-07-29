import { Room, User } from '@prisma/client';
import { excludeUserDetails } from '../../../shared';

export const exlcudeRoomDetails = (room: Room & { owner: User; participants: User[] }) => {
    const { owner, participants, ...rest } = room;
    const newRoom = {
        ...rest,
        owner: excludeUserDetails(owner),
        participants: participants.map((p) => excludeUserDetails(p)),
    };
    return newRoom;
};
