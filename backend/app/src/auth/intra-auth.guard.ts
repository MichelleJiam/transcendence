import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard("42") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;
    super.logIn(request);
    return result;
  }
}
