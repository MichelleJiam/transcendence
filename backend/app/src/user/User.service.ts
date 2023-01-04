import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/CreateUser";
import { UpdateUserSettingsDto } from "./dto/UpdateUserSettings";
import { User } from "./User.entity";
import { AvatarService } from "src/avatar/avatar.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly avatarService: AvatarService,
  ) {}

  getAllUsers() {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findUser(email: string) {
    const foundUser = this.userRepository.findOneBy({
      email: email,
    });
    if (!foundUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return foundUser;
  }

  async findUserById(id: number) {
    const foundUser = this.userRepository.findOneBy({
      id: id,
    });
    if (!foundUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return foundUser;
  }

  async getUserMessages(username: string) {
    // this is how you do it from the opposite side, gets user and displays all messages by said user (Og from message.service.ts)
    const users = await this.userRepository.find({
      select: ["id", "username", "email"],
      where: {
        username: username, // compares usernames and retrieves all the messages
      },
      relations: {
        messages: true,
      },
    });
    if (users) return users;
  }

  async deleteUser(id: number) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
  }

  async updateUser(id: number, settings: UpdateUserSettingsDto) {
    return await this.userRepository.update(id, settings);
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.avatarService.uploadAvatar(imageBuffer, filename);
    await this.userRepository.update(userId, { avatarId: avatar.id });
    return avatar;
  }

  async getAvatarById(id: number) {
    return this.avatarService.getAvatarById(id);
  }
}
