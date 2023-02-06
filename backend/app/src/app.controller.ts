import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { PenaltyDelete } from "./penalty/penalty.scheduler";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly penaltyDelete: PenaltyDelete,
  ) {
    this.penaltyDelete.clearOldPenalties();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
