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
}
