import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResendVerificationDto } from "./dto/resend-verification.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - validation error",
  })
  @ApiResponse({
    status: 401,
    description: "Email already exists",
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    schema: {
      example: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        expiresIn: 86400,
        refreshExpiresIn: 604800,
        user: {
          id: "clxxx",
          email: "user@example.com",
          fullName: "John Doe",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    schema: {
      example: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        expiresIn: 86400,
        refreshExpiresIn: 604800,
        user: {
          id: "clxxx",
          email: "user@example.com",
          fullName: "John Doe",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid refresh token",
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Get("verify-email")
  @ApiOperation({ summary: "Verify user email" })
  @ApiResponse({
    status: 200,
    description: "Email verified successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired token",
  })
  async verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Resend verification email" })
  @ApiResponse({
    status: 200,
    description: "Verification email sent successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Email already verified or not found",
  })
  async resendVerification(@Body() resendDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendDto.email);
  }
}
