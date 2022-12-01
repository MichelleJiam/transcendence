import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

/*
  DTOs stand for data transfer objects
  this is what is used to save data into the database
*/

export class CreateMessageDto {
	@IsNotEmpty()
	@MinLength(3)
	body: string;
}
