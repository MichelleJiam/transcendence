import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  MinLength,
} from "class-validator";

// DTOs stand for data transfer objects
/*
  this is what is used to save data into the database
*/

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumberString()
  intraId!: string;

  @IsNotEmpty()
  @MinLength(8)
  password!: string; // TODO: remove once 42Auth implemented

  // @IsNotEmpty()
  // @IsEmail()
  // email!: string; // TODO: remove once 42Auth implemented

  // @IsNotEmpty()
  // @MinLength(3)
  // username!: string; // will be initialised upon use
}
