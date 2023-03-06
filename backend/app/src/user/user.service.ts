import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import { User } from "./user.entity";
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

  getAllUsersPartial() {
    return this.userRepository.find({
      select: {
        id: true,
        playerName: true,
        status: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findUserByIntraId(intraId: string) {
    const foundUser = this.userRepository.findOneBy({
      intraId: intraId,
    });
    // if (!foundUser) {
    // 	throw new NotFoundException("User not found");
    // }
    return foundUser;
  }

  async findUserById(id: number) {
    const foundUser = this.userRepository.findOneBy({
      id: id,
    });
    // if (!foundUser) {
    //   throw new NotFoundException("User not found");
    // }
    return foundUser;
  }

  async deleteUser(id: number) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException("User not found");
    }
  }

  async updateUser(id: number, settings: UpdateUserSettingsDto) {
    return await this.userRepository.update(id, settings);
  }

  async addAvatar(id: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.avatarService.uploadAvatar(imageBuffer, filename);
    await this.userRepository.update(id, { avatarId: avatar.id });
    return avatar;
  }

  async getAvatarById(id: number) {
    return this.avatarService.getAvatarById(id);
  }

  async setTwoFactorSecret(id: number, secret: string) {
    return this.userRepository.update(id, { twoFASecret: secret });
  }
}
