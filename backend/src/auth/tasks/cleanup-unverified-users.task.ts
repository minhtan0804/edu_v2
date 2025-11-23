import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class CleanupUnverifiedUsersTask {
  constructor(private prisma: PrismaService) {}

  // Run daily at 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCron() {
    console.log("Running cleanup task for unverified users...");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const result = await this.prisma.user.deleteMany({
        where: {
          emailVerified: false,
          createdAt: {
            lt: sevenDaysAgo,
          },
        },
      });

      console.log(
        `Deleted ${result.count} unverified user(s) older than 7 days.`
      );
    } catch (error) {
      console.error("Error cleaning up unverified users:", error);
    }
  }
}
