import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
  Body,
  Put,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { CreateGameDto } from "./dto/create-game.dto";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /* curl http://localhost:3000/game/ */
  @Get()
  async findAll() {
    const games = await this.gameService.findAll();
    return games;
  }

  /* curl http://localhost:3000/game/48 */
  @Get(":id")
  async findOne(@Param("id") id: number) {
    const game = await this.gameService.findOne(id);
    return game;
  }

  /* curl -X POST -d "playerOne=5&playerTwo=6&status=playing" http://localhost:3000/game/ */
  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    const game = await this.gameService.create(createGameDto);
    return game;
  }

  /* curl -X PUT -d "id=55&winnerId=1&loserId=2&status=done&winnerScore=78&loserScore=3" http://localhost:3000/game */
  @Put()
  async update(@Body() createGameDto: CreateGameDto) {
    const game = await this.gameService.update(createGameDto);
    return game;
  }

  /* curl -X DELETE http://localhost:3000/game/48 */
  @Delete(":id")
  @HttpCode(204) /* code for no content used for removing a resource */
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.gameService.remove(id);
  }
}
