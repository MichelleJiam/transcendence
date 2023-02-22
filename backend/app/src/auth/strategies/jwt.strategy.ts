import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { TokenPayload, TokenType } from "../token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
    console.log("Validating JWT token for user ", payload.sub);
    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      console.log("Unauthorized access caught by JwtStrategy");
      throw new UnauthorizedException({
        message: "JWT: no user found in database with id ",
        id: payload.sub,
      });
    }
    // only validates if JWT token payload indicates full access
    if (payload.type === TokenType.FULL) {
      return user;
    }
    // If user doesn't have 2FA enabled, we don't check the
    // twoFactorAuthenticated flag in the payload.
    // if (!user.twoFAEnabled) {
    //   return user;
    // }
    // if (payload.twoFactorAuthenticated) {
    //   return { user };
    // }
  }
}
