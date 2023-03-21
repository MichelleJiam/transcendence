import { CreateUserDto } from "./../user/dto/create-user.dto";
import {
  ConflictException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { RequestUser } from "src/user/user.controller";
import { TokenPayload, TokenType } from "./token-payload.interface";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /************
   * PASSWORD *
   ************/

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

  /********
   * AUTH *
   ********/

  // Returns Authentication cookie with JWT access token as value.
  // Enabling httpOnly option makes cookie inaccessible to clientside JS and therefore XSS attacks.
  public getCookieWithJwtToken(
    id: number,
    intraId: string,
    type: TokenType = TokenType.FULL,
  ) {
    const payload: TokenPayload = { sub: id, intraId, type };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Signed JWT token for user: ${id}, intraID: ${intraId}`);
    return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION}`;
  }

  // Gets user id from the JWT token in the Authentication cookie embedded
  // in the request context and uses UserService to return the user attached
  // to that id.
  public async retrieveUserFromRequestAuthCookie(req: RequestUser) {
    const jwtFromRequest = req.cookies.Authentication;
    const decoded = this.jwtService.decode(jwtFromRequest);
    const user = await this.userService.findUserById(decoded?.sub);
    return user;
  }

  // Sets request.user using user id in auth cookie if it's not set.
  public async getRequestWithUser(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (req.user === undefined || req.user.id === undefined) {
      const user = await this.retrieveUserFromRequestAuthCookie(req);
      if (!user) {
        throw new InternalServerErrorException();
      }
      req.user = user;
    }
    return req;
  }

  // Checks if user has site account. If not, creates one.
  async validateUser(user: CreateUserDto) {
    let existingUser = await this.userService.findUserByIntraId(user.intraId);

    if (!existingUser) {
      existingUser = await this.registerUser(user);
    }

    this.logger.log(`Validated user: ${existingUser.intraId}`);

    return existingUser;
  }

  // Creates account for user in site database.
  async registerUser(user: CreateUserDto) {
    const existingUser = await this.userService.findUserByIntraId(user.intraId);

    if (existingUser) {
      throw new ConflictException("Intra ID already in tied to player account");
    }

    this.logger.log(`Creating user: ${user}`);
    return await this.userService.create(user);
  }
}
