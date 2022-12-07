import { IsNotEmpty, Length } from "class-validator";

export class UpdateUserSettingsDto {
	@IsNotEmpty({ message: "The username can not be empty" })
	@Length(3)
	username: string;
}
