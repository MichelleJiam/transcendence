import { Module } from "@nestjs/common";
import { ChatController } from "./Chat.controller";
import { ChatService } from "./Chat.service";

@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
