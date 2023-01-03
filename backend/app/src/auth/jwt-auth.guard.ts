import { AuthGuard } from "@nestjs/passport";

// saves repetition of jwt authguard
export class JwtAuthGuard extends AuthGuard("jwt") {}
