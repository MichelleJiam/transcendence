import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Match } from "./entities/match.entity";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { Game } from "src/game/entities/game.entity";
import { CreateMatchDto } from "./dto/create-match.dto";

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,

    private readonly userService: UserService,
  ) {}

  async findAll() {
    return await this.matchRepository.find({});
  }

  async findOne(id: number) {
    const match = await this.matchRepository.findOne({
      where: {
        playerId: id,
      },
    });
    return match;
  }

  async create(createMatchDto: CreateMatchDto) {
    if (
      (await this.userService.findUserById(createMatchDto.playerId)) == null
    ) {
      this.logger.debug("unable to add user to match, user does not exist");
      throw new NotFoundException();
    }
    const newPlayer = await this.matchRepository.save(createMatchDto);
    return newPlayer;
  }

  /* logic
        search array for user
        if user - create game, remove other user from array and return that game
        if none - create game, add user to array and return null
    */

  //   async findOne(gameId: number) {
  //     const game = await this.gameRepository.findOne({
  //       where: {
  //         id: gameId,
  //       },
  //       relations: ["winnerId", "loserId"],
  //     });
  //     return game;
  //   }

  //   async update(updateGameDto: UpdateGameDto) {
  //     if (updateGameDto.id !== undefined) {
  //       if ((await this.findOne(updateGameDto.id)) == null) {
  //         this.logger.debug("game does not exist, unable to update");
  //         throw new NotFoundException(
  //           "Unable to update game because game does not exist",
  //         );
  //       }
  //       await this.gameRepository.update(updateGameDto.id, updateGameDto);

  //       await this.gameRepository
  //         .createQueryBuilder()
  //         .relation(Game, "loserId")
  //         .of(updateGameDto.id)
  //         .set(updateGameDto.loserId);

  //       const game = await this.gameRepository
  //         .createQueryBuilder()
  //         .relation(Game, "winnerId")
  //         .of(updateGameDto.id)
  //         .set(updateGameDto.winnerId);

  //       return this.findOne(updateGameDto.id);
  //     }
  //     throw new NotFoundException(
  //       "Unable to update game because no data received from dto",
  //     );
  //   }

  //   async remove(gameId: number) {
  //     if (this.findOne(gameId) == null) {
  //       this.logger.debug("game does not exist, unable to delete");
  //       throw new NotFoundException("game does not exist, unable to delete");
  //     }
  //     await this.gameRepository.delete(gameId);
}
