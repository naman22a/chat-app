import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { UsersService } from '../shared';
import { OkResponse } from '../common/interfaces';
import { RegisterDto } from './dto';

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
}
