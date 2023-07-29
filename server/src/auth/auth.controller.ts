import {
    Body,
    Controller,
    InternalServerErrorException,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from '../shared';
import { OkResponse } from '../common/interfaces';
import { LoginDto, RegisterDto } from './dto';
import * as argon2 from 'argon2';
import { Request, Response } from 'express';
import { COOKIE_NAME } from '../common/constants';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private usersService: UsersService) {}

    @Post('register')
    async register(@Body() body: RegisterDto): Promise<OkResponse> {
        const { username, email } = body;
        try {
            // check if username is already taken
            const usernameTaken = await this.usersService.findOneByUsername(username);
            if (usernameTaken) {
                return {
                    ok: false,
                    errors: [
                        {
                            field: 'username',
                            message: 'username already taken, please try another one',
                        },
                    ],
                };
            }

            // check if user already exists
            const userExists = await this.usersService.findOneByEmail(email);
            if (userExists) {
                return { ok: false, errors: [{ field: 'email', message: 'email already in use' }] };
            }

            // create user in database
            await this.usersService.create(body);

            return { ok: true };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('login')
    async login(@Body() body: LoginDto, @Req() req: Request): Promise<OkResponse> {
        const { usernameOrEmail, password } = body;

        try {
            // check if user exists
            const user = usernameOrEmail.includes('@')
                ? await this.usersService.findOneByEmail(usernameOrEmail)
                : await this.usersService.findOneByUsername(usernameOrEmail);
            if (!user) {
                return {
                    ok: false,
                    errors: [{ field: 'usernameOrEmail', message: 'user not found' }],
                };
            }

            // check if password is correct
            const isMatch = await argon2.verify(user.password, password);
            if (!isMatch) {
                return { ok: false, errors: [{ field: 'password', message: 'wrong password' }] };
            }

            // login with sessions(cookie)
            req.session.userId = user.id;

            return { ok: true };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<OkResponse> {
        return new Promise((resolve) =>
            req.session.destroy((error) => {
                if (error) {
                    resolve({ ok: false });
                }
                res.clearCookie(COOKIE_NAME);
                resolve({ ok: true });
            }),
        );
    }
}
