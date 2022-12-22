import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/Game.entity";
import { User } from "src/user/User.entity";
import { GameService } from "./Game.service";
import { GameController } from "./Game.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Game, User])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
