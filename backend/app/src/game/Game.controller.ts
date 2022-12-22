import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateGameDto } from "./dto/CreateGame.dto";
import { GameService } from "./Game.service";
import { UpdateGameDto } from "./dto/UpdateGame.dto";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getAllGames() {
    return this.gameService.getAllGames();
  }

  @Get(":id")
  getGameById(@Param("id", ParseIntPipe) id: number) {
    return this.gameService.getGameById(id);
  }

  @Get("wins/:winner_id")
  getUserWins(@Param("winner_id") winnerId: number) {
    return this.gameService.getUserWins(winnerId);
  }

  @Get("losses/:loser_id")
  getUserLosses(@Param("loser_id") loserId: number) {
    return this.gameService.getUserLosses(loserId);
  }

  @Post("create")
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Put("update/:id")
  @UsePipes(ValidationPipe)
  async updateGame(
    @Param("id", ParseIntPipe) id: number,
    @Body() game: UpdateGameDto,
  ) {
    return await this.gameService.updateGame(id, game);
  }
}
