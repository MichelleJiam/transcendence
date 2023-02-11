import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";
import { UserService } from "src/user/user.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameRoom } from "./pong.types";

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    private readonly userService: UserService,
  ) {}

  async findAll() {
    return await this.gameRepository.find({});
  }

  async findOne(id: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: id,
      },
    });
    return game;
  }

  async findInPlay(id: number) {
    const game = await this.gameRepository.find({
      where: [{ playerOne: id }, { playerTwo: id }],
      // status: "playing",,
      // status: "playing",
    });
    console.log("game = ", game);
    return game;
  }

  async create(createGameDto: CreateGameDto) {
    if (createGameDto.playerOne === createGameDto.playerTwo) {
      this.logger.debug("cannot create game, players are not unique");
      throw new BadRequestException();
    }
    if (
      (await this.userService.findUserById(createGameDto.playerOne)) == null
    ) {
      this.logger.debug("playerOne does not exist in database");
      throw new NotFoundException();
    }
    if (
      (await this.userService.findUserById(createGameDto.playerTwo)) == null
    ) {
      this.logger.debug("playerTwo does not exist in database");
      throw new NotFoundException();
    }
    /* do we need safeguard to check if either player is already playing - is that even possible? */
    return await this.gameRepository.save(createGameDto);
  }

  async update(gameRoom: GameRoom) {
    if (this.findOne(Number(gameRoom.room)) == null) {
      this.logger.debug("game does not exist, unable to update");
      throw new NotFoundException(
        "Unable to update game because game does not exist",
      );
    }
    const highScore = Math.max(
      gameRoom.playerOne.score,
      gameRoom.playerTwo.score,
    );
    const lowScore = Math.min(
      gameRoom.playerOne.score,
      gameRoom.playerTwo.score,
    );
    const game = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        winnerId: gameRoom.winner,
        loserId: gameRoom.loser,
        winnerScore: highScore,
        loserScore: lowScore,
      })
      .where("id = :id", { id: gameRoom.room })
      .execute();
    return game;
  }
  async remove(gameId: number) {
    if (this.findOne(gameId) == null) {
      this.logger.debug("game does not exist, unable to delete");
      throw new NotFoundException("game does not exist, unable to delete");
    }
    await this.gameRepository.delete(gameId);
  }
}

/* USED WHEN LOSER AND WINNER WERE RELATIONS OF TYPE USER */
// async update(updateGameDto: UpdateGameDto) {
//   if (updateGameDto.id !== undefined) {
//     if ((await this.findOne(updateGameDto.id)) == null) {
//       this.logger.debug("game does not exist, unable to update");
//       throw new NotFoundException(
//         "Unable to update game because game does not exist",
//       );
//     }
//     await this.gameRepository.update(updateGameDto.id, updateGameDto);

//     await this.gameRepository
//       .createQueryBuilder()
//       .relation(Game, "loserId")
//       .of(updateGameDto.id)
//       .set(updateGameDto.loserId);

//     await this.gameRepository
//       .createQueryBuilder()
//       .relation(Game, "winnerId")
//       .of(updateGameDto.id)
//       .set(updateGameDto.winnerId);

//     return this.findOne(updateGameDto.id);
//   }
//   throw new NotFoundException(
//     "Unable to update game because no data received from dto",
//   );
// }
