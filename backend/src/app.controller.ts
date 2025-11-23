import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { PrismaService } from "./prisma/prisma.service";

@ApiTags("health")
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("health")
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({
    status: 200,
    description: "Server and database are healthy",
    schema: {
      example: {
        status: "ok",
        timestamp: "2025-11-23T18:45:00.000Z",
        uptime: 123.45,
        database: "connected",
        environment: "development",
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Server is running but database is disconnected",
    schema: {
      example: {
        status: "error",
        timestamp: "2025-11-23T18:45:00.000Z",
        uptime: 123.45,
        database: "disconnected",
        environment: "development",
        error: "Connection error",
      },
    },
  })
  async health() {
    console.log("Health check start");
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      console.log("Health check end successfully");

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: "connected",
        environment: process.env.NODE_ENV || "development",
      };
    } catch (error) {
      console.log("Health check end with error", error);

      return {
        status: "error",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: "disconnected",
        environment: process.env.NODE_ENV || "development",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @Get()
  @ApiOperation({ summary: "API information" })
  @ApiResponse({
    status: 200,
    description: "API information",
    schema: {
      example: {
        message: "EdTech Healthcare Platform API",
        version: "1.0.0",
        docs: "/health",
      },
    },
  })
  async root() {
    return {
      message: "EdTech Healthcare Platform API",
      version: "1.0.0",
      docs: "/health",
    };
  }
}
