import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({ example: 'my-friends', description: 'The name of the room' })
    @MinLength(3)
    name: string;
}
