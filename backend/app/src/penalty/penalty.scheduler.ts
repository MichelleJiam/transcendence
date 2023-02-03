import * as cron from "node-cron";
import { PenaltyService } from "./penalty.service";

export class PenaltyDelete {
  constructor(private readonly penaltyService: PenaltyService) {
    this.clearOldPenalties();
  }

  async clearOldPenalties(): Promise<void> {
    cron.schedule("15 * * * * *", async () => {
      const penalties =
        await this.penaltyService.getPenaltiesOlderThanFiveMinutes();
      if (Object.keys(penalties).length !== 0) {
        for (const penalty of penalties) {
          this.penaltyService.deletePenalty(penalty.id);
        }
      }
    });
  }
}
