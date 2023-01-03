import { UserService } from "./../user/User.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { User } from "../user/User.entity";
import { UserController } from "../user/User.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.PRIVATE_KEY,
        signOptions: {
          expiresIn: "60m",
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
