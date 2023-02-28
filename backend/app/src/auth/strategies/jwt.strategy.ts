import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { TokenPayload, TokenType } from "../token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private readonly userService: UserService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate(payload: TokenPayload) {
    this.logger.log(`Validating JWT token for user ${payload.sub}`);
    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      this.logger.log("Unauthorized access caught by JwtStrategy");
      throw new UnauthorizedException({
        message: "JWT: no user found in database with id ",
        id: payload.sub,
      });
    }
    // only validates if JWT token payload indicates full access
    if (payload.type === TokenType.FULL) {
      return user;
    }
  }
}
