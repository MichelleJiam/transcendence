import { IsNotEmpty } from "class-validator";

export class CreatePenaltyDto {
  @IsNotEmpty()
  penaltyType!: string;

  @IsNotEmpty()
  user!: number;

  @IsNotEmpty()
  chatroom!: number;
}
