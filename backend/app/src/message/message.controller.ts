import { Controller, Get, ParseIntPipe, Param } from "@nestjs/common";
import { Message } from "./message.entity";
import { MessageService } from "./message.service";

// @Param() converts what's inside the uri that starts with : into a variable
// @Body() tells nest to save whatever's in the body to a particular variable. In this case, a dto class.

@Controller("message")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  getAllMessages(): Promise<Message[]> {
    return this.messageService.getAllMessages();
  }

  @Get("user/id/:id")
  getMessageById(@Param("id", ParseIntPipe) id: number): Promise<Message[]> {
    return this.messageService.getMessageByUserId(id);
  }
}
