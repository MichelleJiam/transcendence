import { AuthService } from "../auth.service";
import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(IntraStrategy.name);
  constructor(private readonly authService: AuthService) {
    super({
      authorizationURL: process.env.INTRA_AUTHORIZE,
      clientID: process.env.INTRA_CLIENT_ID,
      clientSecret: process.env.INTRA_SECRET,
      callbackURL: process.env.INTRA_CALLBACK,
      scope: "public",
      profileFields: {
        id: function (obj: { id: string }) {
          return String(obj.id);
        },
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { id: string },
  ) {
    this.logger.log(`Validating intra user ${profile.id}`);
    const createUser = {
      intraId: profile.id,
    };

    const user = await this.authService.validateUser(createUser);
    return user;
  }
}
