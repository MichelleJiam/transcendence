import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from "@nestjs/common";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(
    private readonly gameService: GameService, // private readonly userService: UserService,
  ) {}

  @Get()
  getAllGames() {
    console.log(this.gameService.getAllGames());
    return this.gameService.getAllGames();
  }

  @Get(":id")
  getGameById(@Param("id", ParseIntPipe) id: number) {
    return this.gameService.getGameById(id);
  }

  @Delete(":id/delete")
  delete(@Param("id", ParseIntPipe) gameId: number) {
    return this.gameService.deleteGame(gameId);
  }

  @Patch("update")
  async update(gameId: number, userId: number) {
    return await this.gameService.updateGame(gameId, userId);
  }

  @Post("create")
  create(userId: number) {
    return this.gameService.createGame(userId);
  }

  @Get(":id/match")
  async match(@Param("id", ParseIntPipe) id: number) {
    const games = await this.getAllGames();

    /* if there is a game in a waiting state then update */
    for (let i = 0; i < games.length; i++) {
      if (games[i].status == "waiting") {
        this.update(games[i].id, id);
        console.log("match updatedGame " + games[i]);
        return games[i].id;
      }
    }
    const game = await this.create(id);
    return game.id;
    // console.log("hello", id);
  }
}

// @Get("wins/:winner_id")
// getUserWins(@Param("winner_id") winnerId: number) {
//   return this.gameService.getUserWins(winnerId);
// }

// @Get("losses/:loser_id")
// getUserLosses(@Param("loser_id") loserId: number) {
//   return this.gameService.getUserLosses(loserId);
// }

// @Post("create")
// create(@Body() createGameDto: CreateGameDto) {
//   return this.gameService.createGame(createGameDto);
// }
