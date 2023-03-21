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
