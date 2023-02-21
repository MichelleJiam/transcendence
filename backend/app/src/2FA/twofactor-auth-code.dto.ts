import { IsString, IsNotEmpty, IsDefined } from "class-validator";

export class TwoFactorAuthCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  twoFactorAuthCode!: string;
}
