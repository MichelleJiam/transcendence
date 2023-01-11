import { IsNotEmpty } from "class-validator";

export class CreateChatroomDto {
  @IsNotEmpty()
  type!: string;

  @IsNotEmpty()
  chatroomName!: string;

  password!: string;

  @IsNotEmpty()
  user!: number;
}
