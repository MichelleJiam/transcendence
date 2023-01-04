import { IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { User } from "src/user/user.entity";
import { Chatroom } from "src/chat/chat.entity";
import { DeepPartial } from "typeorm";

/*
  DTOs stand for data transfer objects
  this is what is used to save data into the database
*/

export class CreateMessageDto {
  @IsNotEmpty()
  @MinLength(1, {
    message: "Cannot be empty",
  })
  @MaxLength(500, {
    message: "Message too long",
  })
  body!: string;

  userId!: DeepPartial<User>;
  chatroomId!: DeepPartial<Chatroom>;
}
