import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlocklistController } from "./blocklist.controller";
import { Blocklist } from "./blocklist.entity";
import { BlocklistService } from "./blocklist.service";

@Module({
  imports: [TypeOrmModule.forFeature([Blocklist])],
  controllers: [BlocklistController],
  providers: [BlocklistService],
})
export class BlocklistModule {}
