import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService) {}

    async findOneById(id: number) {
        return await this.prisma.room.findUnique({
            where: { id },
            include: { owner: true, participants: true },
        });
    }

    async findOneByName(name: string) {
        return await this.prisma.room.findUnique({
            where: { name },
            include: { owner: true, participants: true },
        });
    }

    async create(name: string, ownerId: number) {
        return await this.prisma.room.create({
            data: { name: name.toLowerCase().trim().replace(' ', '-'), ownerId },
            include: { owner: true, participants: true },
        });
    }

    async join(userId: number, roomName: string) {
        const room = await this.findOneByName(roomName);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        await this.prisma.room.update({
            where: { name: roomName },
            data: { participants: { set: [...room.participants, user] } },
        });
    }

    async myRooms(ownerId: number) {
        return await this.prisma.room.findMany({
            where: { ownerId },
            include: { owner: true, participants: true },
        });
    }

    async joinedRooms(userId: number) {
        let rooms = await this.prisma.room.findMany({
            include: { owner: true, participants: true },
        });

        rooms = rooms.filter((room) => {
            for (const participant of room.participants) {
                if (participant.id === userId) {
                    return true;
                }
            }

            return false;
        });

        return rooms;
    }
}
