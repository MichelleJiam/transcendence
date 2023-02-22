import { IsNotEmpty } from "class-validator";

export class AddMemberDto {
  @IsNotEmpty()
  member!: number;

  password?: string;
}
