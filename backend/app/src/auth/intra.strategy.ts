import { AuthService } from "./auth.service";
import { Strategy, VerifyCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from "src/user/user.entity";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.INTRA_CLIENT_ID,
      clientSecret: process.env.INTRA_SECRET,
      callbackURL: process.env.INTRA_CALLBACK,
      scope: "public",
      profileFields: {
        id: function (obj: any) {
          return String(obj.id);
        },
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User | undefined> {
    const createUser = {
      intraId: profile.id,
      password: "password", // TODO: remove once 42Auth implemented
    };
    const user = await this.authService.validateUser(createUser);
    return user;
  }
}
