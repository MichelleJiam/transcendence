import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from "@nestjs/common";
import { AvatarService } from "./avatar.service";

@Controller("avatar")
@UseInterceptors(ClassSerializerInterceptor)
export class AvatarController {
  constructor(private avatarService: AvatarService) {}
}
