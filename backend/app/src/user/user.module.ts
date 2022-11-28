import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/message/message.entity";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Module({
	imports: [TypeOrmModule.forFeature([User, Message])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
