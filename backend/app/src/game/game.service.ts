import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository, WhereExpressionBuilder } from "typeorm";
import { Game } from "./entities/game.entity";
import { UserService } from "src/user/user.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameRoom, GameWithPlayer } from "./pong.types";

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

  async findActive() {
    const games = await this.gameRepository.find({
      where: {
        state: "playing",
      },
    });
    return games;
  }

  async findOne(id: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: id,
      },
    });
    return game;
  }

  async findGameFromPlayerSocket(playerSocket: string) {
    let playerNum = 0;
    const foundGame = await this.gameRepository
      .createQueryBuilder("game")
      .where("game.state = :playing", { playing: "playing" })
      .andWhere(
        new Brackets((qb: WhereExpressionBuilder) => {
          qb.where("game.playerOneSocket = :playerSocket", {
            playerSocket,
          }).orWhere("game.playerTwoSocket = :playerSocket", { playerSocket });
        }),
      )
      .getOne();

    if (foundGame) {
      playerNum = foundGame.playerOneSocket === playerSocket ? 1 : 2;
    }

    return { game: foundGame, playerNum: playerNum };
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

  async updateSocket(gameRoom: GameRoom) {
    if ((await this.findOne(Number(gameRoom.id))) == null) {
      this.logger.debug("game does not exist, unable to update");
      throw new NotFoundException(
        "Unable to update game because game does not exist",
      );
    }
    const game = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        playerOneSocket: gameRoom.playerOne.socket,
        playerTwoSocket: gameRoom.playerTwo.socket,
      })
      .where("id = :id", { id: gameRoom.id })
      .execute();
    return game;
  }

  async update(gameRoom: GameRoom) {
    if ((await this.findOne(Number(gameRoom.id))) == null) {
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
    if (gameRoom.playerOne.score > gameRoom.playerTwo.score) {
      gameRoom.winner = gameRoom.playerOne.id;
      gameRoom.loser = gameRoom.playerTwo.id;
    } else if (gameRoom.playerOne.score < gameRoom.playerTwo.score) {
      gameRoom.loser = gameRoom.playerOne.id;
      gameRoom.winner = gameRoom.playerTwo.id;
    }
    const game = await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set({
        winnerId: gameRoom.winner,
        loserId: gameRoom.loser,
        winnerScore: highScore,
        loserScore: lowScore,
        state: "done",
      })
      .where("id = :id", { id: gameRoom.id })
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

  // setPlayerAsDisconnected(gameRoom: GameRoom, disconnectedPlayer: number) {
  //   if (disconnectedPlayer === 1) {
  //     gameRoom.playerOne.disconnected = true;
  //   } else if (disconnectedPlayer === 2) {
  //     gameRoom.playerTwo.disconnected = true;
  //   }
  // }

  bothPlayersDisconnected(gameRoom: GameRoom) {
    return gameRoom.playerOne.disconnected && gameRoom.playerTwo.disconnected;
  }

  handleForfeit(gameRoom: GameRoom) {
    if (gameRoom.playerOne.disconnected) {
      console.log("player one forfeited");
      gameRoom.playerOne.score = 0;
      gameRoom.playerTwo.score = 3;
      gameRoom.winner = 2;
    } else {
      console.log("player two forfeited");
      gameRoom.playerTwo.score = 0;
      gameRoom.playerOne.score = 3;
      gameRoom.winner = 1;
    }
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
