import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { excludeUserDetails } from './utils';
import { AuthGuard } from '../../auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async getUsers() {
        const users = await this.usersService.findAll();
        return users.map((user) => excludeUserDetails(user));
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async me(@Req() req: Request) {
        const userId = req.session.userId;
        const user = await this.usersService.findOneById(userId);
        return excludeUserDetails(user);
    }
}
