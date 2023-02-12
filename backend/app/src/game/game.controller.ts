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
  BadRequestException,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameRoom } from "./pong.types";

@Controller("game")
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  @Get()
  async findAll() {
    const games = await this.gameService.findAll();
    return games;
  }

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
      throw new NotFoundException("Unable to create game");
    });
    return game;
  }

  @Put()
  async update(@Body() gameRoom: GameRoom) {
    const game = await this.gameService.update(gameRoom).catch(() => {
      this.logger.debug("updating game stats failed");
      throw new BadRequestException("unable to update finished game");
    });
    return game;
  }

  @Delete(":id")
  @HttpCode(204) /* code for no content used for removing a resource */
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.gameService.remove(id);
  }
}
