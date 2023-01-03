import { CreateUserDto } from "./../user/dto/CreateUser";
import { exist } from "@hapi/joi";
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../user/User.entity";
import { UserService } from "./../user/User.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // returns JWT access token
  public jwtLogin(user: User): string {
    const payload = { username: user.username, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async validateUser(user: CreateUserDto) {
    const existingUser = await this.userService.findUserById(user.id);

    // TODO: check if null returned when user doesn't exist
    if (!existingUser) {
      this.registerUser(user);
      // throw new UnauthorizedException("User not found");
    }

    console.log("Validated user: ", existingUser);
    return existingUser;
  }

  async registerUser(user: CreateUserDto) {
    const existingUser = await this.userService.findUser(user.email);

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    console.log("Creating user: ", user);
    return await this.userService.create(user);
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 42);
  }
}
