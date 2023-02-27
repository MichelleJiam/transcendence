import { ConfigModule } from "@nestjs/config";
import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { IntraStrategy } from "./strategies/intra.strategy";
import { UserModule } from "../user/user.module";
import { PartialJwtStrategy } from "./strategies/partial-jwt.strategy";

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
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
  providers: [AuthService, JwtStrategy, IntraStrategy, PartialJwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
