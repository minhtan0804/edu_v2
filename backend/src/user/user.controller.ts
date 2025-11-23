import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "Get all users (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "List of users with pagination",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin only",
  })
  findAll(@Query() query: QueryUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "User details",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin only",
  })
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Email already exists",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin only",
  })
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: { userId: string } }
  ) {
    // Prevent updating yourself (optional security check)
    if (id === req.user.userId) {
      throw new BadRequestException("Cannot update your own account");
    }

    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin only",
  })
  remove(
    @Param("id") id: string,
    @Request() req: { user: { userId: string } }
  ) {
    // Prevent deleting yourself
    if (id === req.user.userId) {
      throw new BadRequestException("Cannot delete your own account");
    }

    return this.userService.remove(id);
  }
}

