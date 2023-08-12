import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { excludeUserDetails } from '../../shared';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) {}

    async findAll(roomId: number) {
        return await this.prisma.message.findMany({
            where: { roomId },
            include: { sender: true },
        });
    }

    async create(senderId: number, roomId: number, { text }: CreateMessageDto) {
        return await this.prisma.message.create({
            data: { text, senderId, roomId },
            include: { sender: true },
        });
    }
}
