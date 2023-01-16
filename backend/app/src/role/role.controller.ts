import {
  Controller,
  Post,
  Get,
  Body,
  NotFoundException,
  ParseIntPipe,
  Param,
} from "@nestjs/common";
import { NotFoundError } from "rxjs";
import { RoleService } from "./role.service";

@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getAllRoles() {
    try {
      return this.roleService.getAllRoles();
    } catch (err) {
      throw NotFoundException;
    }
  }

  @Get("/chatroom/:chatroomId")
  async getRolesByChatroomId(@Param("chatroomId", ParseIntPipe) id: number) {
    try {
      return this.roleService.getRolesByChatroomId(id);
    } catch (err) {
      console.log(err);
    }
  }
}
