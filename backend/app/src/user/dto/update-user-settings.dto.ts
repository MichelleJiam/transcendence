import { IsNotEmpty, Length } from "class-validator";

export class UpdateUserSettingsDto {
  @IsNotEmpty({ message: "Player name can not be empty" })
  @Length(3)
  playerName!: string;
}
