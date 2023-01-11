import { CreateUserDto } from "./../user/dto/create-user.dto";
import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // PASSWORD

  // Hashes `password` for security, using 10 salt rounds for efficiency.
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // Compares plain text `receivedPassword` to hashed version and returns true if passwords match.
  public async checkPassword(
    receivedPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(receivedPassword, hashedPassword);
  }

  // AUTH

  // Returns Authentication cookie with JWT access token as value.
  // Enabling httpOnly option makes cookie inaccessible to clientside JS and therefore XSS attacks.
  public getCookieWithJwtToken(id: number) {
    const payload = { sub: id };
    const accessToken = this.jwtService.sign(payload);

    console.log("Signed token for user: ", id);
    console.log("Token: ", accessToken);
    return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION}`;
  }

  // Checks if user has site account. If not, creates one.
  async validateUser(user: CreateUserDto) {
    let existingUser = await this.userService.findUserByIntraId(user.intraId);

    if (!existingUser) {
      existingUser = await this.registerUser(user);
    }

    console.log("Validated user: ", existingUser.intraId);

    return existingUser;
  }

  // Creates account for user in site database.
  async registerUser(user: CreateUserDto) {
    const existingUser = await this.userService.findUserByIntraId(user.intraId);

    if (existingUser) {
      throw new ConflictException("Intra ID already in tied to player account");
    }

    console.log("Creating user: ", user);
    return await this.userService.create(user);
  }

  // twofactor methods
}
