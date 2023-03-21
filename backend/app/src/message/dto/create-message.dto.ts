import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  chatroomId!: number;

  @IsNotEmpty()
  @MinLength(1, {
    message: "Cannot be empty",
  })
  @MaxLength(500, {
    message: "Message too long",
  })
  body!: string;

  @IsNotEmpty()
  userId!: number;
}
