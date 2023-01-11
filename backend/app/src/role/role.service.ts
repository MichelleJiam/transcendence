import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Role } from "./role.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public roleTypes: string[] = ["owner", "admin", "member"];

  public async createRole(
    userId: number,
    chatroom: Chatroom,
    roleName: string,
  ): Promise<Role> {
    const newRole = new Role();
    newRole.chatroom.push(chatroom);
    newRole.roleName = roleName;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (user) {
      newRole.user.push(user);
    } else {
      throw new HttpException("User does not exist.", HttpStatus.BAD_REQUEST);
    }
    return newRole;
  }

  public async isAdminOfChatroom(userId: number, chatroomId: number) {
    const admin = await this.roleRepository.findOne({
      where: {
        roleName: "admin",
        user: {
          id: userId,
        },
        chatroom: {
          id: chatroomId,
        },
      },
    });
    if (admin) return true;
    else return false;
  }
  public async isOwnerOfChatroom(userId: number, chatroomId: number) {
    const admin = await this.roleRepository.findOne({
      where: {
        roleName: "owner",
        user: {
          id: userId,
        },
        chatroom: {
          id: chatroomId,
        },
      },
    });
    if (admin) return true;
    else return false;
  }
  public async removeRoleFromUserInChatroom(
    userId: number,
    currentChatroom: Chatroom,
    roleType: string,
  ): Promise<void> {
    currentChatroom.role = currentChatroom.role.filter((role: Role) => {
      return (
        role.roleName !== roleType &&
        role.user.find((user: User) => {
          return user.id === userId;
        }) &&
        role.chatroom.find((chatroom: Chatroom) => {
          return chatroom.id === currentChatroom.id;
        })
      );
    });
    await this.roleRepository.save(currentChatroom);
  }
}
