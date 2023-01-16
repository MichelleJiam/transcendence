import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PenaltyController } from "./penalty.controller";
import { Penalty } from "./penalty.entity";
import { PenaltyService } from "./penalty.service";

@Module({
  imports: [TypeOrmModule.forFeature([Penalty])],
  controllers: [PenaltyController],
  providers: [PenaltyService],
})
export class PenaltyModule {}
