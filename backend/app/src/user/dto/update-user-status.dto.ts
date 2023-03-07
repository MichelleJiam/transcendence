import { IsNotEmpty } from "class-validator";

export class UpdateUserStatusDto {
  @IsNotEmpty()
  status!: number;
}
