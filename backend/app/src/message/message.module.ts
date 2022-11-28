import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { MessageController } from "./message.controller";
import { Message } from "./message.entity";
import { MessageService } from "./message.service";

@Module({
	imports: [TypeOrmModule.forFeature([Message, User])],
	controllers: [MessageController],
	providers: [MessageService],
})
export class MessageModule {}
