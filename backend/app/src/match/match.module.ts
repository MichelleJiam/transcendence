import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { AvatarService } from "src/avatar/avatar.service";
import { Avatar } from "src/avatar/avatar.entity";
import { Match } from "./entities/match.entity";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { GameService } from "src/game/game.service";
import { Game } from "src/game/entities/game.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Match, Game, User, Avatar])],
  controllers: [MatchController],
  providers: [MatchService, GameService, UserService, AvatarService],
})
export class MatchModule {}
