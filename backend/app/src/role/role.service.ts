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

    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    this.initClass();
  }

  async initClass() {
    const findAdmin = await this.roleRepository.find({
      where: {
        roleName: "admin",
      },
    });
    const findMember = await this.roleRepository.find({
      where: {
        roleName: "member",
      },
    });
    const findOwner = await this.roleRepository.find({
      where: {
        roleName: "owner",
      },
    });

    if (Object.keys(findAdmin).length == 0) {
      const admin = new Role();
      admin.roleName = "admin";
      await this.roleRepository.save(admin);
    }

    if (Object.keys(findMember).length == 0) {
      const member = new Role();
      member.roleName = "member";
      await this.roleRepository.save(member);
    }

    if (Object.keys(findOwner).length == 0) {
      const owner = new Role();
      owner.roleName = "owner";
      await this.roleRepository.save(owner);
    }
  }

  public roleTypes: string[] = ["owner", "admin", "member"];

  async getAllRoles(): Promise<Role[]> {
    const foundRoles = await this.roleRepository.find({
      relations: {
        user: true,
        chatroom: true,
      },
      select: {
        id: true,
        roleName: true,
        user: true,
      },
    });
    return foundRoles;
  }

  async getRolesByChatroomId(chatroomId: number): Promise<Role[]> {
    const chatroom = await this.chatroomRepository.findOne({
      relations: {
        message: true,
        role: true,
        penalty: true,
        user: true,
      },
      where: {
        id: chatroomId,
      },
      select: {
        role: true,
      },
    });
    if (!chatroom) {
      throw new HttpException("Chatroom not found", HttpStatus.NOT_FOUND);
    }
    return chatroom.role;
  }

  public async createRole(userId: number, roleName: string): Promise<Role> {
    // get role from db and then add things to it and save it again
    const newRole = new Role();
    newRole.roleName = roleName;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (user) {
      newRole.user = [user];
    } else {
      throw new HttpException("User does not exist.", HttpStatus.BAD_REQUEST);
    }
    return newRole;
  }

  public async isAdminOfChatroom(userId: number, chatroomId: number) {
    const admin = await this.userRepository.findOne({
      where: {
        id: userId,
        role: {
          roleName: "admin",
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
    const admin = await this.userRepository.findOne({
      where: {
        id: userId,
        role: {
          roleName: "owner",
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
        })
      );
    });
    await this.roleRepository.save(currentChatroom);
  }
}
