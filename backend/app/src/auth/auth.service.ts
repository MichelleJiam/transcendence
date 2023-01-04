import { CreateUserDto } from "./../user/dto/create-user.dto";
import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../user/user.entity";
import { UserService } from "./../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // returns JWT access token
  public getJwtToken(user: User): string {
    const payload = { intraId: user.intraId, sub: user.id, twoFA: !user.twoFA };

    console.log("Signed token for user: ", user.id);
    return this.jwtService.sign(payload);
  }

  async validateUser(user: CreateUserDto) {
    let existingUser = await this.userService.findUserByIntraId(user.intraId);

    if (!existingUser) {
      existingUser = await this.registerUser(user);
    }

    console.log("Validated user: ", existingUser.intraId);

    const accessToken = this.getJwtToken(existingUser);

    return { user: existingUser, accessToken };
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
