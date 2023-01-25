/*
  DTOs stand for data transfer objects
  this is what is used to save data into the database
*/

import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateMessageDto {
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
