import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { RoomsModule } from '../rooms';

@Module({
    imports: [RoomsModule],
    providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
