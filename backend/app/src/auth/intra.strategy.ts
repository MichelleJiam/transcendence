import { AuthService } from "./auth.service";
import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { validate } from "class-validator";
import { User } from "src/user/User.entity";
import { Profile } from "passport";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.INTRA_CLIENT_ID,
      clientSecret: process.env.INTRA_SECRET,
      callbackURL: process.env.INTRA_CALLBACK,
      profileFields: {
        id: function (obj: any) {
          return String(obj.id);
        },
        username: "login",
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    callback: (error: any, user: User) => void,
  ): Promise<User | undefined> {
    // const { id: intraId, username } = profile;
    const userProfile = {
      username: profile.username,
      id: profile.id,
      email: "", // TODO: remove once gone from CreateUserDto
      password: "",
    };
    const user = await this.authService.validateUser(userProfile);
    return callback(err, user);
  }
}
