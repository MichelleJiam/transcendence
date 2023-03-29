import { IsNotEmpty, IsNumberString } from "class-validator";

// DTOs stand for data transfer objects
/*
  this is what is used to save data into the database
*/

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumberString()
  intraId!: string;
}
