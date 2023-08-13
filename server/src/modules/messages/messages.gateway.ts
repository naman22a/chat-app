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
import { Message, User } from '@prisma/client';
import { UsersService, excludeUserDetails } from '../../shared';
import { OkResponse } from '../../common/interfaces';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
    namespace: 'chat',
    cors: { origin: process.env.CORS_ORIGIN, credentials: true },
})
export class MessagesGateway {
    constructor(
        private usersService: UsersService,
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
    async handleMessages(
        @ConnectedSocket() socket: Socket<any, ServerToClientEvents>,
        @MessageBody('roomId') roomId: number,
    ) {
        const room = await this.roomsService.findOneById(roomId);
        socket.join(room.name);
        const msgs = await this.messagesService.findAll(roomId);
        return msgs.map((msg) => excludeMessageDetails(msg));
    }

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
        // const newMsg = await this.messagesService.create(senderId, room.id, { text: textMsg });
        const newMsg = {
            id: Date.now(),
            text: textMsg,
            senderId,
            roomId: room.id,
            sender: room.participants.filter((p) => p.id === senderId)[0],
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies Message & { sender: User };
        console.log(excludeMessageDetails(newMsg));
        // TODO: fix join room it is not working because of it

        socket.to(room.name).emit('receiveMessage', excludeMessageDetails(newMsg));

        return excludeMessageDetails(newMsg);
    }
}
