import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// saves repetition of jwt authguard
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
