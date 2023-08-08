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
import { excludeMessageDetails } from './utils';
import { Message } from '@prisma/client';

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

    @SubscribeMessage('messages')
    async handleMessages(@MessageBody('roomId') roomId: number) {
        const msgs = await this.messagesService.findAll(roomId);
        return msgs.map((msg) => excludeMessageDetails(msg));
    }

    // TODO: fix async web sockets
    // https://docs.nestjs.com/websockets/gateways#asynchronous-responses
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() socket: Socket<any, ServerToClientEvents>,
        @MessageBody('message') textMsg: string,
        @MessageBody('roomName') roomName: string,
    ): Promise<Message | null> {
        const req = socket.request as Request;
        const senderId = req.session.userId;
        const room = await this.roomsService.findOneByName(roomName);
        if (!room) return null;
        const newMsg = await this.messagesService.create(senderId, room.id, { text: textMsg });
        socket.to(room.name).emit('receiveMessage', newMsg);
    }
}
