import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { RoomsModule } from '../rooms';

@Module({
    imports: [RoomsModule],
    providers: [MessagesService, MessagesGateway],
    controllers: [MessagesController],
})
export class MessagesModule {}
