import 'dotenv/config';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents } from './types';
import { UsersService } from '../../shared';
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

@UseGuards(WsAuthGuard)
@WebSocketGateway({
    namespace: 'rooms',
    cors: { origin: process.env.CORS_ORIGIN, credentials: true },
})
export class RoomsGateway {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService<EnvironmentVariables>,
    ) {}
    @WebSocketServer()
    server: Server<any, ServerToClientEvents>;

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
    async handleMessage(
        @ConnectedSocket() socket: Socket<any, ServerToClientEvents>,
        @MessageBody('roomName') roomName: string,
    ) {
        const req = socket.request as Request;
        const userId = req.session.userId;

        const user = await this.usersService.findOneById(userId);

        socket.join(roomName);
        socket.to(roomName).emit('newUserJoined', user);

        return user;
    }
}
