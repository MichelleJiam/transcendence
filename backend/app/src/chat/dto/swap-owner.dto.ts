import { IsNotEmpty } from "class-validator";

export class SwapOwnerDto {
  @IsNotEmpty()
  oldOwner!: number;

  @IsNotEmpty()
  newOwner!: number;
}
