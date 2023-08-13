import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    Req,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { exlcudeRoomDetails } from './utils';
import { AuthGuard } from '../../auth/auth.guard';
import { CreateRoomDto } from './dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('rooms')
@UseGuards(AuthGuard)
@Controller('rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService) {}

    @Get('id/:id')
    async findOneById(@Param('id', ParseIntPipe) id: number) {
        try {
            // find room by id
            const room = await this.roomsService.findOneById(id);

            // check if room is null
            if (!room) return null;

            return exlcudeRoomDetails(room);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('name/:name')
    async findOneByName(@Param('name') name: string) {
        try {
            // check if name is empty
            if (!name) return false;

            // find room by name
            const room = await this.roomsService.findOneByName(name);

            // check if room is null
            if (!room) return null;

            return exlcudeRoomDetails(room);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('create')
    async create(@Body() { name }: CreateRoomDto, @Req() req: Request) {
        if (!name) return null;
        const ownerId = req.session.userId;
        try {
            // check if name is already taken
            const nameTaken = await this.roomsService.findOneByName(name);
            if (nameTaken) return null;

            // create room in database
            const room = await this.roomsService.create(name, ownerId);

            // become a participant of the room
            this.roomsService.becomeAParticipant(ownerId, name);

            return exlcudeRoomDetails(room);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('my')
    async myRooms(@Req() req: Request) {
        const userId = req.session.userId;
        const rooms = await this.roomsService.myRooms(userId);
        return rooms.map((room) => exlcudeRoomDetails(room));
    }

    @Get('joined')
    async joined(@Req() req: Request) {
        const userId = req.session.userId;
        const rooms = await this.roomsService.joinedRooms(userId);
        return rooms.map((room) => exlcudeRoomDetails(room));
    }
}
