import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

// DTOs stand for data transfer objects
/*
  this is what is used to save data into the database
*/

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username!: string;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
