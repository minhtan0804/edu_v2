import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { InstructorService } from "./instructor.service";
import { SubmitVerificationDto } from "./dto/submit-verification.dto";
import { VerifyInstructorDto } from "./dto/verify-instructor.dto";

@Controller("instructor")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post("verification")
  @Roles("INSTRUCTOR")
  submitVerification(
    @Request() req: { user: { userId: string } },
    @Body() submitVerificationDto: SubmitVerificationDto
  ) {
    return this.instructorService.submitVerification(
      req.user.userId,
      submitVerificationDto
    );
  }

  @Get("verification/my")
  @Roles("INSTRUCTOR")
  getMyVerification(@Request() req: { user: { userId: string } }) {
    return this.instructorService.getMyVerification(req.user.userId);
  }

  @Get("verification/pending")
  @Roles("ADMIN")
  getAllPendingVerifications() {
    return this.instructorService.getAllPendingVerifications();
  }

  @Put("verification/verify")
  @Roles("ADMIN")
  verifyInstructor(
    @Request() req: { user: { userId: string } },
    @Body() verifyInstructorDto: VerifyInstructorDto
  ) {
    return this.instructorService.verifyInstructor(
      req.user.userId,
      verifyInstructorDto
    );
  }
}

