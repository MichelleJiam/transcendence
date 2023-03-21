import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  UseGuards,
} from "@nestjs/common";
import { currentUser } from "src/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "src/user/user.entity";
import { isCurrentUser } from "src/user/user.utils";
import { Message } from "./message.entity";
import { MessageService } from "./message.service";

@Controller("message")
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get("user/:id")
  async getMessageById(
    @Param("id", ParseIntPipe) id: number,
    @currentUser() user: User,
  ): Promise<Message[] | undefined> {
    try {
      isCurrentUser(user.id, id);
      return this.messageService.getMessageByUserId(id);
    } catch (err) {
      console.error(err);
    }
  }
}
