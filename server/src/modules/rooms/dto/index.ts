import { MinLength } from 'class-validator';

export class CreateRoomDto {
    @MinLength(3)
    name: string;
}
