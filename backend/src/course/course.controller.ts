import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@ApiTags("courses")
@ApiBearerAuth("JWT-auth")
@Controller("courses")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: "Create a new course (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "Course created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Slug already exists or invalid category",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin only",
  })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all courses (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "List of courses",
  })
  findAll() {
    return this.courseService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get course by ID (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Course details with sections and lessons",
  })
  @ApiResponse({
    status: 404,
    description: "Course not found",
  })
  findOne(@Param("id") id: string) {
    return this.courseService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update course (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Course updated successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Slug already exists or invalid category",
  })
  @ApiResponse({
    status: 404,
    description: "Course not found",
  })
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete course (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Course deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Course not found",
  })
  remove(@Param("id") id: string) {
    return this.courseService.remove(id);
  }
}
