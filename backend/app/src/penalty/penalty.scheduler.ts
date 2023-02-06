import * as cron from "node-cron";
import { PenaltyService } from "./penalty.service";

export class PenaltyDelete {
  constructor(private readonly penaltyService: PenaltyService) {
    this.clearOldPenalties();
  }

  async clearOldPenalties(): Promise<void> {
    cron.schedule("15 * * * * *", async () => {
      this.penaltyService.clearOldPenalties();
      console.log("cleared penalties");
    });
  }
}
