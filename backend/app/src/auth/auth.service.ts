import { CreateUserDto } from "./../user/dto/create-user.dto";
import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // returns JWT access token
  public getJwtToken(user: User) {
    const payload = { sub: user.id, iid: user.intraId };
    const accessToken = this.jwtService.sign(payload);

    console.log("Signed token for user: ", user.id);
    console.log("Token: ", accessToken);
    return accessToken;
  }

  async validateUser(user: CreateUserDto) {
    let existingUser = await this.userService.findUserByIntraId(user.intraId);

    if (!existingUser) {
      existingUser = await this.registerUser(user);
    }

    console.log("Validated user: ", existingUser.intraId);

    // const accessToken = this.getJwtToken(existingUser);
    // return { user: existingUser, accessToken };
    return existingUser;
  }

  async registerUser(user: CreateUserDto) {
    const existingUser = await this.userService.findUserByIntraId(user.intraId);

    if (existingUser) {
      throw new ConflictException("Intra ID already in tied to player account");
    }

    console.log("Creating user: ", user);
    return await this.userService.create(user);
  }

  // twofactor methods

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 42);
  }
}
