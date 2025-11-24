import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createCourseDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createCourseDto.categoryId} not found`
      );
    }

    // Check if slug already exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { slug: createCourseDto.slug },
    });

    if (existingCourse) {
      throw new BadRequestException(
        `Course with slug ${createCourseDto.slug} already exists`
      );
    }

    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        price: createCourseDto.price ?? 0,
      },
      include: {
        category: true,
        sections: {
          include: {
            lessons: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        category: true,
        _count: {
          select: {
            sections: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        sections: {
          include: {
            lessons: {
              orderBy: { position: "asc" },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findOne(id); // Check if exists

    // Check if category exists (if being updated)
    if (updateCourseDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateCourseDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateCourseDto.categoryId} not found`
        );
      }
    }

    // Check if slug already exists (if being updated)
    if (updateCourseDto.slug) {
      const existingCourse = await this.prisma.course.findUnique({
        where: { slug: updateCourseDto.slug },
      });

      if (existingCourse && existingCourse.id !== id) {
        throw new BadRequestException(
          `Course with slug ${updateCourseDto.slug} already exists`
        );
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        category: true,
        sections: {
          include: {
            lessons: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.course.delete({
      where: { id },
    });
  }
}
