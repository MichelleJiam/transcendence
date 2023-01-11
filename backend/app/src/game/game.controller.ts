import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  Body,
  HttpCode,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";

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

  @Post(":id/create")
  async create(
    @Param("id") userId: number,
    @Body() createGameDto: CreateGameDto,
  ) {
    const game = await this.gameService.createGame(createGameDto, userId);
    console.log(game);
    return game;
  }

  @Patch(":userId/update/:gameId")
  async update(
    @Param("userId") userId: number,
    @Param("gameId") gameId: number,
  ) {
    const game = await this.gameService.updateGame(gameId, userId);
    console.log(game);
    return game;
  }

  //   @Get(":id/match")
  //   async match(@Param("id", ParseIntPipe) id: number) {
  //     const games = await this.getAllGames();

  //     /* if there is a game in a waiting state then update */
  //     for (let i = 0; i < games.length; i++) {
  //       if (games[i].status == "waiting") {
  //         this.update(games[i].id, id);
  //         console.log("match updatedGame " + games[i]);
  //         return games[i].id;
  //       }
  //     }
  //     const game = await this.create(id);
  //     return game.id;
  //     // console.log("hello", id);
  //   }
}

// @Get("wins/:winner_id")
// getUserWins(@Param("winner_id") winnerId: number) {
//   return this.gameService.getUserWins(winnerId);
// }

// @Get("losses/:loser_id")
// getUserLosses(@Param("loser_id") loserId: number) {
//   return this.gameService.getUserLosses(loserId);
// }

/* with delete best practice is not to return deleted resource, only return status code */
// @Delete("delete/:gameId")
// @HttpCode(204) // code for no content used for removing a resource
// async remove(@Param("gameId", ParseIntPipe) gameId: number) {
//   await this.gameService.removeGame(gameId);
// }
