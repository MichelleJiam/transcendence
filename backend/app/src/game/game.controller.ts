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
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { CreateGameDto } from "./dto/create-game.dto";

@Controller("game")
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  /* curl http://localhost:3000/game/ */
  @Get()
  async findAll() {
    const games = await this.gameService.findAll();
    return games;
  }

  /* curl http://localhost:3000/game/48 */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const game = await this.gameService.findOne(id);
    if (game === null) {
      this.logger.debug("game does not exist in database");
      throw new NotFoundException("Unable to find game");
    } else {
      return game;
    }
  }

  /* curl -X POST -d "playerOne=5&playerTwo=6&status=playing" http://localhost:3000/game/ */
  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    const game = await this.gameService.create(createGameDto).catch(() => {
      throw new NotFoundException(
        "Unable to create game because one or both users do not exist",
      );
    });
    return game;
  }

  /* curl -X PUT -d "id=55&winnerId=1&loserId=2&status=done&winnerScore=78&loserScore=3" http://localhost:3000/game */
  @Put()
  async update(@Body() createGameDto: CreateGameDto) {
    const game = await this.gameService.update(createGameDto).catch(() => {
      this.logger.debug("updating game failed");
      throw new NotFoundException("Unable to update game");
    });
    return game;
  }

  /* curl -X DELETE http://localhost:3000/game/48 */
  @Delete(":id")
  @HttpCode(204) /* code for no content used for removing a resource */
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.gameService.remove(id);
  }
}
