import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../config';
import { MessagesService, excludeMessageDetails } from '../messages';
import { RoomsService } from '../rooms';
import { UsersService, excludeUserDetails } from '../../shared';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents } from '../../common/events';
import { Message, User } from '@prisma/client';
import { OkResponse } from '../../common/interfaces';
import { Request } from 'express';
import * as session from 'express-session';
import { COOKIE_NAME, __prod__ } from '../../common/constants';
import { redis } from '../../common/redis';
import { SocketAuthMiddleware } from '../../auth/ws.middleware';
const RedisStore = require('connect-redis').default;

const sleep = (ms: number = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

@WebSocketGateway({
    cors: { origin: process.env.CORS_ORIGIN, credentials: true },
})
export class ChatGateway {
    constructor(
        private configService: ConfigService<EnvironmentVariables>,
        private usersService: UsersService,
        private roomsService: RoomsService,
        private messagesService: MessagesService,
    ) {}

    @WebSocketServer()
    io: Server<any, ServerToClientEvents>;

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
    ): Promise<OkResponse & { data?: null | Omit<User, 'password'> }> {
        try {
            const req = socket.request as Request;
            const userId = req.session.userId;

            const user = await this.usersService.findOneById(userId);
            const room = await this.roomsService.findOneByName(roomName);
            // room not found
            if (!room)
                return { ok: false, errors: [{ field: 'roomName', message: 'room not found' }] };

            socket.join(roomName);

            // already a participant
            if (room.participants.filter((p) => p.id === userId)[0]) {
                return {
                    ok: true,
                    errors: [{ field: 'roomName', message: 'room already joined' }],
                };
            }

            // not a participant yet
            await this.roomsService.becomeAParticipant(userId, roomName);
            socket.to(roomName).emit('joined', excludeUserDetails(user));

            return {
                ok: true,
                data: excludeUserDetails(user),
            };
        } catch (error) {
            console.error(error);
            return { ok: false };
        }
    }

    @SubscribeMessage('messages')
    async handleMessages(@MessageBody('roomId') roomId: number) {
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
        socket.to(room.name).emit('receiveMessage', excludeMessageDetails(newMsg));

        return excludeMessageDetails(newMsg);
    }

    @SubscribeMessage('typing')
    async handleTyping(
        @ConnectedSocket() socket: Socket<any, ServerToClientEvents>,
        @MessageBody('roomName') roomName: string,
        @MessageBody('isTyping') isTyping: boolean,
    ) {
        const req = socket.request as Request;
        const senderId = req.session.userId;
        const sender = await this.usersService.findOneById(senderId);

        socket.broadcast.to(roomName).emit('typingResponse', { name: sender.username, isTyping });
    }
}
