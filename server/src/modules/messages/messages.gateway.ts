import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ServerToClientEvents } from '../../common/events';
import { MessagesService } from './messages.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../config';
import { COOKIE_NAME, __prod__ } from '../../common/constants';
import { redis } from '../../common/redis';
import * as session from 'express-session';
const RedisStore = require('connect-redis').default;
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../../auth/ws-auth.guard';
import { SocketAuthMiddleware } from '../../auth/ws.middleware';
import { RoomsService } from '../rooms/rooms.service';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
    namespace: 'messages',
    cors: { origin: process.env.CORS_ORIGIN, credentials: true },
})
export class MessagesGateway {
    constructor(
        private messagesService: MessagesService,
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

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() socket: Socket<any, ServerToClientEvents>,
        @MessageBody('message') textMsg: string,
        @MessageBody('roomId') roomId: number,
    ): Promise<string> {
        const req = socket.request as Request;
        const senderId = req.session.userId;
        await this.messagesService.create(senderId, roomId, { text: textMsg });
        const room = await this.roomsService.findOneById(roomId);
        socket.to(room.name).emit('receiveMessage', textMsg);
        return textMsg;
    }
}
