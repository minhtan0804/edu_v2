import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { SubmitVerificationDto } from "./dto/submit-verification.dto";
import { VerifyInstructorDto } from "./dto/verify-instructor.dto";

@Injectable()
export class InstructorService {
  constructor(private prisma: PrismaService) {}

  async submitVerification(
    userId: string,
    submitVerificationDto: SubmitVerificationDto
  ) {
    // Check if user exists and is an instructor
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.role !== "INSTRUCTOR") {
      throw new BadRequestException("User is not an instructor");
    }

    // Check if user has already submitted verification
    const existingVerification =
      await this.prisma.instructorVerification.findUnique({
        where: { userId },
      });

    if (existingVerification?.isVerified) {
      throw new BadRequestException("Instructor is already verified");
    }

    // Update or create verification record
    return this.prisma.instructorVerification.upsert({
      where: { userId },
      create: {
        userId,
        ...submitVerificationDto,
        isVerified: false,
      },
      update: {
        ...submitVerificationDto,
        isVerified: false, // Reset verification status when updating
        verifiedAt: null,
        verifiedBy: null,
      },
    });
  }

  async getMyVerification(userId: string) {
    const verification = await this.prisma.instructorVerification.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    if (!verification) {
      throw new NotFoundException("Verification record not found");
    }

    return verification;
  }

  async getAllPendingVerifications() {
    return this.prisma.instructorVerification.findMany({
      where: { isVerified: false },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async verifyInstructor(
    adminId: string,
    verifyInstructorDto: VerifyInstructorDto
  ) {
    const { userId, isVerified } = verifyInstructorDto;

    const verification = await this.prisma.instructorVerification.findUnique({
      where: { userId },
    });

    if (!verification) {
      throw new NotFoundException("Verification record not found");
    }

    return this.prisma.instructorVerification.update({
      where: { userId },
      data: {
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
        verifiedBy: isVerified ? adminId : null,
      },
    });
  }
}
