import { PartialType } from "@nestjs/mapped-types";
import { CreateGameDto } from "./create-game.dto";

export class UpdateGameDto extends PartialType(CreateGameDto) {}

/* will have same properties as createGameDto but all fields will be optional */
