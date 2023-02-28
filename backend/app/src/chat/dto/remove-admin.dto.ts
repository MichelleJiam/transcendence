import { IsNotEmpty } from "class-validator";

export class RemoveAdminDto {
  @IsNotEmpty()
  deleteAdmin!: number;

  @IsNotEmpty()
  byAdmin!: number;
}
