import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { User } from "src/user/user.entity";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([Game, User])],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
