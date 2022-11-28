import { Controller, Post, Get, Body, ParseIntPipe, Param } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create_message.dto";
import { MessageService } from "./message.service";

@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Get()
	getAllMessages(){
		return this.messageService.getAllMessages();
	}

	@Get('user/id/:id')
	getMessageById(@Param('id', ParseIntPipe) id: number) {
		return this.messageService.getMessageByUserId(id);
	}

	@Get('user/:username')
	getMessageByUsername(@Param('username') username: string) {
		return this.messageService.getMessageByUsername(username);
	}

	@Post('create')
	create(@Body() createMessageDto: CreateMessageDto) {
		return this.messageService.create(createMessageDto);
	}
}
