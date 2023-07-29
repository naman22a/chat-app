import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateUserDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async findOneById(id: number) {
        return await this.prisma.user.findUnique({ where: { id } });
    }

    async findOneByUsername(username: string) {
        return await this.prisma.user.findUnique({ where: { username } });
    }

    async findOneByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async create(data: CreateUserDto) {
        const { password, ...rest } = data;
        const hashedPassword = await argon2.hash(password);
        const avatar = `https://api.dicebear.com/6.x/pixel-art/svg?seed=${rest.username}`;
        return await this.prisma.user.create({
            data: { password: hashedPassword, avatar, ...rest },
        });
    }
}
