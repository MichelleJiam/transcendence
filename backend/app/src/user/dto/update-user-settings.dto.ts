import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class UpdateUserSettingsDto {
  @IsString()
  @IsNotEmpty({ message: "Player name can not be empty" })
  @Length(3, 8, { message: "Player name must be between 3 and 8 characters" })
  playerName!: string;

  @IsBoolean()
  @IsNotEmpty({ message: "twoFAEnabled value can not be empty" })
  twoFAEnabled!: boolean;

  @IsOptional()
  twoFASecret?: string | undefined;
}

// can we extend from another DTO? check lecture 13: the update payload

// force input validation errors:
//  curl -i --header "Content-Type: application/json" --request PUT --data '{"playerName":"hellotestyo"}' http://localhost:3000/user/3/update-settings
//  curl -i --header "Content-Type: application/json" --request PUT --data '{"playerName":"hello", "twoFA":""}' http://localhost:3000/user/3/update-settings
//  curl -i --header "Content-Type: application/json" --request PUT --data '{"playerName":"hellohelllooo", "twoFA": "5"}' http://localhost:3000/user/3/update-settings
