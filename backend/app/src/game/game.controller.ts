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
  UseGuards,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameRoom } from "./pong.types";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("game")
@UseGuards(JwtAuthGuard)
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  @Get()
  async findAll() {
    const games = await this.gameService.findAll();
    return games;
  }

  @Get("/active")
  async findActive() {
    const games = await this.gameService.findActive();
    if (games === null) {
      this.logger.debug("no active games");
      throw new NotFoundException("Unable to find active game");
    } else {
      return games;
    }
  }

  @Get(":id/state")
  async findGamesFromId(@Param("id", ParseIntPipe) id: number) {
    return await this.gameService.findGamesFromId(id);
  }

  @Get(":id/dm")
  async findGameFromDm(@Param("id", ParseIntPipe) id: number) {
    return await this.gameService.findGameFromDm(id);
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
  @HttpCode(204)
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.gameService.remove(id);
  }
}
