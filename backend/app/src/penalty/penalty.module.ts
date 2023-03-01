import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PenaltyController } from "./penalty.controller";
import { Penalty } from "./penalty.entity";
import { PenaltyGateway } from "./penalty.gateway";
import { PenaltyService } from "./penalty.service";

@Module({
  imports: [TypeOrmModule.forFeature([Penalty])],
  controllers: [PenaltyController],
  providers: [PenaltyService, PenaltyGateway],
})
export class PenaltyModule {}
