import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RoomsModule } from '../rooms';
import { MessagesModule } from '../messages';
import { UsersModule } from '../../shared';

@Module({
    imports: [UsersModule, RoomsModule, MessagesModule],
    providers: [ChatGateway],
})
export class ChatModule {}
