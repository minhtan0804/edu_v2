import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async create(createSectionDto: CreateSectionDto) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createSectionDto.courseId },
    });

    if (!course) {
      throw new NotFoundException(
        `Course with ID ${createSectionDto.courseId} not found`
      );
    }

    return this.prisma.section.create({
      data: {
        ...createSectionDto,
        position: createSectionDto.position ?? 0,
      },
      include: {
        course: true,
        lessons: {
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async findAll(courseId?: string) {
    const where = courseId ? { courseId } : {};

    return this.prisma.section.findMany({
      where,
      include: {
        course: true,
        lessons: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { position: "asc" },
    });
  }

  async findOne(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: {
        course: true,
        lessons: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return section;
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
      include: {
        course: true,
        lessons: {
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.section.delete({
      where: { id },
    });
  }
}
