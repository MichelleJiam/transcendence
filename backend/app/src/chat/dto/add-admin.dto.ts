import { IsNotEmpty } from "class-validator";

export class AddAdminDto {
  @IsNotEmpty()
  newAdmin!: number;
  @IsNotEmpty()
  byAdmin!: number;
}
