import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { RoomsModule } from '../rooms';
import { UsersModule } from '../../shared';

@Module({
    imports: [RoomsModule, UsersModule],
    providers: [MessagesService],
    exports: [MessagesService],
})
export class MessagesModule {}
