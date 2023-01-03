import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from "@nestjs/common";
import { AvatarService } from "./avatar.service";

// Avatar controller we probably don't need, this happens in user.controller.ts

@Controller("avatar")
@UseInterceptors(ClassSerializerInterceptor)
export class AvatarController {
  constructor(private avatarService: AvatarService) {}
}
