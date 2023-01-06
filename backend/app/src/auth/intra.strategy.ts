import { AuthService } from "./auth.service";
import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      authorizationURL: process.env.INTRA_AUTHORIZE,
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

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("Attempting to validate user according to IntraStrategy");
    const createUser = {
      intraId: profile.id,
      password: "password", // TODO: remove once 42Auth implemented
    };

    return await this.authService.validateUser(createUser);
  }
}
