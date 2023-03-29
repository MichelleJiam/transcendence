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
import { GameRoom } from "./pong.types";
import { LeaderboardService } from "src/leaderboard/leaderboard.service";
import { UpdateLeaderboardUserDto } from "src/leaderboard/dto/update-leaderboard-user.dto";

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly userService: UserService,
    private readonly leaderboardService: LeaderboardService,
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

  async findGamesFromId(id: number) {
    return await this.gameRepository
      .createQueryBuilder("game")
      .where(
        "game.state = :done AND (game.playerOne = :playerOneId OR game.playerTwo = :playerTwoId)",
        { done: "done", playerOneId: id, playerTwoId: id },
      )
      .execute();
  }

  async findGameInPlayFromId(id: number) {
    return await this.gameRepository
      .createQueryBuilder("game")
      .where(
        "game.state = :playing AND (game.playerOne = :playerOneId OR game.playerTwo = :playerTwoId)",
        { playing: "playing", playerOneId: id, playerTwoId: id },
      )
      .execute();
  }

  async findGameToUpdate(gameId: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: gameId,
        state: "playing",
        winnerId: undefined,
        loserId: undefined,
      },
    });
    return game;
  }

  async findGamesForHistory(id: number) {
    return await this.gameRepository
      .createQueryBuilder("game")
      .limit(10)
      .offset(0)
      .orderBy("game.id", "DESC")
      .where(
        "game.state = :done AND (game.playerOne = :playerOneId OR game.playerTwo = :playerTwoId)",
        { done: "done", playerOneId: id, playerTwoId: id },
      )
      .execute();
  }

  async findGameFromPlayerSocket(playerSocket: string) {
    let playerNum = 0,
      playerId = null;
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
      playerId = playerNum === 1 ? foundGame.playerOne : foundGame.playerTwo;
    }

    return { game: foundGame, playerNum: playerNum, playerId: playerId };
  }

  async findGameFromDm(id: number) {
    const game = await this.gameRepository
      .createQueryBuilder("game")
      .where("game.state = :dm", { dm: "dm" })
      .andWhere(
        new Brackets((qb: WhereExpressionBuilder) => {
          qb.where("game.playerOne = :playerOneId", {
            playerOneId: id,
          }).orWhere("game.playerTwo = :playerTwoId", { playerTwoId: id });
        }),
      )
      .getOne();
    if (game != null && game.join === true) {
      await this.gameRepository.update(game.id, { state: "playing" });
    } else if (game != null) {
      await this.gameRepository.update(game.id, { join: true });
    }
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
    return await this.gameRepository.save(createGameDto);
  }

  async updateSocket(gameRoom: GameRoom) {
    if ((await this.findOne(Number(gameRoom.id))) == null) {
      this.logger.debug("game does not exist, unable to update");
      throw new NotFoundException(
        "Unable to update game because game does not exist",
      );
    }
    if (gameRoom.player === 1) {
      const game = await this.gameRepository
        .createQueryBuilder()
        .update(Game)
        .set({
          playerOneSocket: gameRoom.playerOne.socket,
        })
        .where("id = :id", { id: gameRoom.id })
        .execute();
      return game;
    } else {
      const game = await this.gameRepository
        .createQueryBuilder()
        .update(Game)
        .set({
          playerTwoSocket: gameRoom.playerTwo.socket,
        })
        .where("id = :id", { id: gameRoom.id })
        .execute();
      return game;
    }
  }

  async setGameToDone(gameId: number) {
    await this.gameRepository.update(gameId, { state: "done" });
  }

  async update(gameRoom: GameRoom) {
    if ((await this.findOne(Number(gameRoom.id))) == null) {
      this.logger.debug("game does not exist, unable to update");
      throw new NotFoundException(
        "Unable to update game because game does not exist",
      );
    }
    const game = await this.findGameToUpdate(gameRoom.id);
    if (!game) {
      this.logger.debug("Game has already been updated");
      return;
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
    await this.gameRepository.update(game.id, {
      winnerId: gameRoom.winner,
      loserId: gameRoom.loser,
      winnerScore: highScore,
      loserScore: lowScore,
      state: "done",
    });
    const leaderboardDto = new UpdateLeaderboardUserDto();
    leaderboardDto.winner = gameRoom.winner;
    leaderboardDto.loser = gameRoom.loser;
    console.log("Updated game repo, about to update leaderboard");
    await this.leaderboardService.updateUsersInLeaderboard(leaderboardDto);
    return game;
  }

  async remove(gameId: number) {
    if (this.findOne(gameId) == null) {
      this.logger.debug("game does not exist, unable to delete");
      throw new NotFoundException("game does not exist, unable to delete");
    }
    await this.gameRepository.delete(gameId);
  }

  bothPlayersDisconnected(gameRoom: GameRoom) {
    return gameRoom.playerOne.disconnected && gameRoom.playerTwo.disconnected;
  }

  setForfeitScoreWinner(gameRoom: GameRoom) {
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
    return gameRoom;
  }

  setDisconnectedPlayer(gameRoom: GameRoom, disconnectedPlayer: number) {
    if (disconnectedPlayer === 1) {
      gameRoom.playerOne.disconnected = true;
    } else {
      gameRoom.playerTwo.disconnected = true;
    }
  }
}
