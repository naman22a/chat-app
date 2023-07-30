import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        if (context.getType() !== 'ws') {
            return true;
        }

        const client: Socket = context.switchToWs().getClient();
        WsAuthGuard.validateRequest(client);

        return true;
    }

    static validateRequest(socket: Socket) {
        const userId = (socket?.request as Request)?.session?.userId;
        if (!userId) {
            throw new WsException('Unauthorized');
        }
        return true;
    }
}
