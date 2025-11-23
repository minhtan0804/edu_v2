import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

// Import dayjs with proper CommonJS support
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dayjs = require("dayjs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const duration = require("dayjs/plugin/duration");

// Extend dayjs with duration plugin
dayjs.extend(duration);

import { EmailService } from "../email/email.service";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours

    // Create user - role mặc định là USER
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: "USER",
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        email,
        fullName || null,
        verificationToken
      );
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't fail registration if email fails, but log it
    }

    return {
      user,
      message:
        "Registration successful! Please check your email to verify your account.",
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        "Email not verified. Please check your email and verify your account."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      ...tokens,
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Default 1 day in seconds
      return dayjs.duration(1, "day").asSeconds();
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    // Map short unit to dayjs duration unit
    const unitMap: Record<string, string> = {
      s: "second",
      m: "minute",
      h: "hour",
      d: "day",
    };

    const dayjsUnit = unitMap[unit] || "day";
    return dayjs.duration(value, dayjsUnit).asSeconds();
  }

  private getExpiresInSeconds(configKey: string, defaultValue: string): number {
    const expiresIn = this.configService.get<string>(configKey) || defaultValue;
    return this.parseExpiresIn(expiresIn);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const jwtExpiresIn =
      this.configService.get<string>("JWT_EXPIRES_IN") || "1d";
    const refreshExpiresIn =
      this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") || "7d";

    // Convert to seconds for response (lấy từ config)
    const accessTokenExpiresInSeconds = this.getExpiresInSeconds(
      "JWT_EXPIRES_IN",
      "1d"
    );
    const refreshTokenExpiresInSeconds = this.getExpiresInSeconds(
      "JWT_REFRESH_EXPIRES_IN",
      "7d"
    );

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtExpiresIn as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>("JWT_REFRESH_SECRET") ||
        "default-refresh-secret",
      expiresIn: refreshExpiresIn as any,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresInSeconds,
      refreshExpiresIn: refreshTokenExpiresInSeconds,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token with refresh secret
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get<string>("JWT_REFRESH_SECRET") ||
          "default-refresh-secret",
      });

      // Get user from database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email);

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    // Check if email is already verified (prevent spam/duplicate verification)
    if (user.emailVerified) {
      throw new BadRequestException(
        "Email has already been verified. You can now log in."
      );
    }

    // Check if token has expired (24 hours)
    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      throw new BadRequestException(
        "Verification token has expired. Please request a new verification email."
      );
    }

    // Verify email and clear token to prevent reuse
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null, // Clear token to prevent reuse
        emailVerificationExpires: null,
      },
    });

    return {
      message: "Email verified successfully! You can now log in.",
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("Email not found");
    }

    if (user.emailVerified) {
      throw new BadRequestException("Email already verified");
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours

    // Update user with new token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendResendVerificationEmail(
        email,
        user.fullName || null,
        verificationToken
      );
      return {
        message: "Verification email has been resent. Please check your inbox.",
      };
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new BadRequestException(
        "Unable to send email. Please try again later."
      );
    }
  }
}
