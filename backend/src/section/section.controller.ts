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
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";
import { SectionService } from "./section.service";

@ApiTags("sections")
@ApiBearerAuth("JWT-auth")
@Controller("sections")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @ApiOperation({ summary: "Create a new section (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "Section created successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Course not found",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin only",
  })
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all sections (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "List of sections",
  })
  findAll(@Query("courseId") courseId?: string) {
    return this.sectionService.findAll(courseId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get section by ID (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Section details with lessons",
  })
  @ApiResponse({
    status: 404,
    description: "Section not found",
  })
  findOne(@Param("id") id: string) {
    return this.sectionService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update section (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Section updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Section not found",
  })
  update(@Param("id") id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionService.update(id, updateSectionDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete section (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Section deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Section not found",
  })
  remove(@Param("id") id: string) {
    return this.sectionService.remove(id);
  }
}
