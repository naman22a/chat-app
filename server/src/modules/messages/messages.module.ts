import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { RoomsModule } from '../rooms';
import { UsersModule } from '../../shared';

@Module({
    imports: [RoomsModule, UsersModule],
    providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
