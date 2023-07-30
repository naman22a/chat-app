import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { excludeUserDetails } from '../../shared';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) {}

    async findAll(roomId: number) {
        return await this.prisma.message.findMany({
            where: { roomId },
            include: { sender: true },
        });
    }
}
