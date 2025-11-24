import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { InstructorController } from "./instructor.controller";
import { InstructorService } from "./instructor.service";

@Module({
  imports: [PrismaModule],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
