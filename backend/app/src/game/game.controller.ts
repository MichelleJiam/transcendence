import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { Game } from "./entities/game.entity";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async findAll() {
    const games = await this.gameService.findAllGames();
    console.log(games);
    return games;
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const game = await this.gameService.findOneGame(id);
    console.log(game);
    return game;
  }

  @Post()
  create(userId: number) {
    return this.gameService.createGame(userId);
  }

  @Patch()
  async addPlayer(gameId: number, userId: number) {
    return this.gameService.updateGame(gameId, userId);
  }

  // @Get(":gameId/:userId")
  // async updateWinner(
  //   @Param("gameId") gameId: number,
  //   @Param("userId") userId: number,
  // ) {
  //   return await this.gameService.updateWinner(gameId, userId);
  // }

  @Get(":id/match")
  async match(@Param("id", ParseIntPipe) userId: number) {
    const game = await this.gameService.inWaitingState();
    if (!game) {
      const newGame = await this.create(userId);
      console.log("new game: ", newGame);
      return newGame;
    }
    const updatedGame = await this.addPlayer(game.id, userId);
    console.log("updated game: ", this.findOne(updatedGame.id));
    return updatedGame;
  }

  /* with delete best practice is not to return deleted resource, only return status code */
  @Delete(":gameId/delete")
  @HttpCode(204) /* code for no content used for removing a resource */
  async remove(@Param("gameId", ParseIntPipe) gameId: number) {
    await this.gameService.removeGame(gameId);
  }
}

/*********************** REVISIT ***************************/

// @Get("wins/:winner_id")
// getUserWins(@Param("winner_id") winnerId: number) {
//   return this.gameService.getUserWins(winnerId);
// }

// @Get("losses/:loser_id")
// getUserLosses(@Param("loser_id") loserId: number) {
//   return this.gameService.getUserLosses(loserId);
// }

// @Post(":id/create")
// async create(
//   @Param("id") userId: number,
//   @Body() createGameDto: CreateGameDto,
// ) {
//   const game = await this.gameService.createGame(createGameDto, userId);
//   console.log(game);
//   return game;
// }

// @Patch(":userId/update/:gameId")
// async update(
//   @Param("userId") userId: number,
//   @Param("gameId") gameId: number,
// ) {
//   const game = await this.gameService.updateGame(gameId, userId);
//   console.log(game);
//   return game;
// }
