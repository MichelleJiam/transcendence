import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { IntraStrategy } from "./strategies/intra.strategy";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    PassportModule,
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          algorithm: "HS256",
          expiresIn: process.env.JWT_EXPIRATION,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, IntraStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
