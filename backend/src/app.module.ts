import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { CleanupUnverifiedUsersTask } from "./auth/tasks/cleanup-unverified-users.task";
import { CategoryModule } from "./category/category.module";
import { InstructorModule } from "./instructor/instructor.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    CategoryModule,
    InstructorModule,
  ],
  controllers: [AppController],
  providers: [CleanupUnverifiedUsersTask],
})
export class AppModule {}
