import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonService } from "./lesson.service";

@ApiTags("lessons")
@ApiBearerAuth("JWT-auth")
@Controller("lessons")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @ApiOperation({ summary: "Create a new lesson (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "Lesson created successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Section not found",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin only",
  })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all lessons (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "List of lessons",
  })
  findAll(@Query("sectionId") sectionId?: string) {
    return this.lessonService.findAll(sectionId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get lesson by ID (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Lesson details",
  })
  @ApiResponse({
    status: 404,
    description: "Lesson not found",
  })
  findOne(@Param("id") id: string) {
    return this.lessonService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update lesson (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Lesson updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Lesson not found",
  })
  update(@Param("id") id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(id, updateLessonDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete lesson (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Lesson deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Lesson not found",
  })
  remove(@Param("id") id: string) {
    return this.lessonService.remove(id);
  }
}
