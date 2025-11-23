import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { EmailModule } from "../email/email.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const expiresIn = config.get<string>("JWT_EXPIRES_IN") || "1d";
        return {
          secret: config.get<string>("JWT_SECRET") || "default-secret",
          signOptions: {
            expiresIn:
              expiresIn as JwtModuleOptions["signOptions"]["expiresIn"],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
