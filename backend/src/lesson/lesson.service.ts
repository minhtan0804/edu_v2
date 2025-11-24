import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto) {
    // Check if section exists
    const section = await this.prisma.section.findUnique({
      where: { id: createLessonDto.sectionId },
    });

    if (!section) {
      throw new NotFoundException(
        `Section with ID ${createLessonDto.sectionId} not found`
      );
    }

    return this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        position: createLessonDto.position ?? 0,
      },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async findAll(sectionId?: string) {
    const where = sectionId ? { sectionId } : {};

    return this.prisma.lesson.findMany({
      where,
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
      orderBy: { position: "asc" },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
