import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
// import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { IntraStrategy } from "./intra.strategy";
// import { User } from "../user/user.entity";
// import { UserController } from "../user/user.controller";
import { UserModule } from "../user/user.module";
import { HttpModule } from "@nestjs/axios";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    PassportModule,
    UserModule,
    ConfigModule,
    HttpModule,
    // TypeOrmModule.forFeature([User]),
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
