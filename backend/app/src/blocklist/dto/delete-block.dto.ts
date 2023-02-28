import { IsNotEmpty } from "class-validator";

export class DeleteBlockDto {
  @IsNotEmpty()
  blocklistOwner!: number;
  @IsNotEmpty()
  blockedUser!: number;
}
