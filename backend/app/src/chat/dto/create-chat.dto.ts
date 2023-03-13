import { MaxLength } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class CreateChatroomDto {
  @IsNotEmpty()
  type!: string;

  @IsNotEmpty()
  @MaxLength(250, {
    message: "chat name too long",
  })
  chatroomName!: string;

  password!: string;

  @IsNotEmpty()
  user!: number;

  otherUser?: number;
}
