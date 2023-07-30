import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../../auth/auth.guard';
import { excludeMessageDetails } from './utils';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('messages')
@UseGuards(AuthGuard)
@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) {}

    @Get('room/:id')
    async getMessages(@Param('id', ParseIntPipe) id: number) {
        const msgs = await this.messagesService.findAll(id);
        return msgs.map((msg) => excludeMessageDetails(msg));
    }
}
