import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { TokenPayload, TokenType } from "../token-payload.interface";

@Injectable()
export class PartialJwtStrategy extends PassportStrategy(
  Strategy,
  "partial-jwt",
) {
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
    console.log("Validating partial JWT token for user ", payload.sub);
    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      console.log("Unauthorized access caught by PartialJwtStrategy");
      throw new UnauthorizedException({
        message: "PartialJWT: no user found in database with id ",
        id: payload.sub,
      });
    }
    return user;
  }
}
