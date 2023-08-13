import 'dotenv/config';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ServerToClientEvents } from '../../common/events';
import { UsersService, excludeUserDetails } from '../../shared';
import { COOKIE_NAME, __prod__ } from '../../common/constants';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../config';
import { redis } from '../../common/redis';
import * as session from 'express-session';
const RedisStore = require('connect-redis').default;
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../../auth/ws-auth.guard';
import { SocketAuthMiddleware } from '../../auth/ws.middleware';
import { RoomsService } from './rooms.service';
import { OkResponse } from '../../common/interfaces';
import { User } from '@prisma/client';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
    namespace: 'chat',
    cors: { origin: process.env.CORS_ORIGIN, credentials: true },
})
export class RoomsGateway {
    constructor(
        private usersService: UsersService,
        private roomsService: RoomsService,
        private configService: ConfigService<EnvironmentVariables>,
    ) {}

    afterInit(client: Socket) {
        const wrap = (middleware: Function) => (socket: Socket, next: (err?: Error) => void) =>
            middleware(socket.request, {}, next);

        const secret = this.configService.get('SESSION_SECRET');
        client.use(
            wrap(
                session({
                    name: COOKIE_NAME,
                    secret,
                    resave: false,
                    cookie: {
                        sameSite: 'lax',
                        httpOnly: true,
                        secure: __prod__,
                        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                    },
                    store: new RedisStore({ client: redis }),
                    saveUninitialized: false,
                }),
            ) as any,
        );
        client.use(SocketAuthMiddleware() as any);
    }

    @SubscribeMessage('join')
    async joinRoom(
        @ConnectedSocket() socket: Socket<any, ServerToClientEvents>,
        @MessageBody('roomName') roomName: string,
    ): Promise<OkResponse & { data?: Omit<User, 'password'> }> {
        try {
            const req = socket.request as Request;
            const userId = req.session.userId;

            const user = await this.usersService.findOneById(userId);
            const room = await this.roomsService.findOneByName(roomName);
            // room not found
            if (!room)
                return { ok: false, errors: [{ field: 'roomName', message: 'room not found' }] };

            // join the room
            socket.join(roomName);

            if (room.participants.filter((p) => p.id === userId)[0]) {
                return {
                    ok: true,
                    errors: [{ field: 'roomName', message: 'room already joined' }],
                };
            }
            // not joined room yet(is not a participant)
            else {
                await this.roomsService.becomeAParticipant(userId, roomName);
                socket.to(roomName).emit('newUserJoined', excludeUserDetails(user));
            }

            return {
                ok: true,
                data: excludeUserDetails(user),
            };
        } catch (error) {
            console.error(error);
            return { ok: false };
        }
    }
}
