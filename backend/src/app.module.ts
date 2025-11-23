import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { CleanupUnverifiedUsersTask } from "./auth/tasks/cleanup-unverified-users.task";
import { CategoryModule } from "./category/category.module";
import { CourseModule } from "./course/course.module";
import { InstructorModule } from "./instructor/instructor.module";
import { LessonModule } from "./lesson/lesson.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SectionModule } from "./section/section.module";
import { UserModule } from "./user/user.module";

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
    UserModule,
    CourseModule,
    SectionModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [CleanupUnverifiedUsersTask],
})
export class AppModule {}
