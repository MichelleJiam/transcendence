import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { TokenPayload } from "../token-payload.interface";

@Injectable()
export class PartialJwtStrategy extends PassportStrategy(
  Strategy,
  "partial-jwt",
) {
  private readonly logger = new Logger(PartialJwtStrategy.name);
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
    // this.logger.log(`Validating partial JWT token for user ${payload.sub}`);
    const user = await this.userService.findUniqueUserByIdAndIntra(
      payload.sub,
      payload.intraId,
    );

    if (!user) {
      this.logger.log("Unauthorized access caught by PartialJwtStrategy");
      throw new UnauthorizedException({
        message: "PartialJWT: no user found in database with id ",
        id: payload.sub,
      });
    }
    return user;
  }
}
