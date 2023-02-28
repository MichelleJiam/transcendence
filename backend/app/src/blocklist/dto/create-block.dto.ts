import { IsNotEmpty } from "class-validator";

export class CreateBlockDto {
  @IsNotEmpty()
  blocklistOwner!: number;
  @IsNotEmpty()
  blockedUser!: number;
}
