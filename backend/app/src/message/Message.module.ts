import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/User.entity";
import { MessageController } from "./Message.controller";
import { Message } from "./Message.entity";
import { MessageService } from "./Message.service";

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
