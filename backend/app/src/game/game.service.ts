import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";
import { User } from "src/user/user.entity";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.gameRepository.find({});
  }

  async findOne(gameId: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id: gameId,
      },
      relations: ["winnerId", "loserId"],
    });
    return game;
  }

  async create(createGameDto: CreateGameDto) {
    /* validate that both users exist before creating the game */
    return await this.gameRepository.save(createGameDto);
  }

  async update(updateGameDto: UpdateGameDto) {
    if (updateGameDto.id !== undefined) {
      await this.gameRepository.update(updateGameDto.id, updateGameDto);

      await this.gameRepository
        .createQueryBuilder()
        .relation(Game, "loserId")
        .of(updateGameDto.id)
        .set(updateGameDto.loserId);

      const game = await this.gameRepository
        .createQueryBuilder()
        .relation(Game, "winnerId")
        .of(updateGameDto.id)
        .set(updateGameDto.winnerId);

      return this.findOne(updateGameDto.id);
    }
    throw new NotFoundException(
      "Unable to update game because it does not exist",
    );
  }

  async remove(gameId: number) {
    await this.gameRepository.delete(gameId);
  }
}
