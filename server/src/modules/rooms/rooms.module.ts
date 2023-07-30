import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
import { UsersModule } from '../../shared';

@Module({
    imports: [UsersModule],
    controllers: [RoomsController],
    providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}
