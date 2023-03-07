import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";
import { User } from "./user.entity";
import { AvatarService } from "src/avatar/avatar.service";
import { AchievementService } from "src/achievement/achievement.service";
import { Achievement } from "src/achievement/achievement.entity";
import { Achievements } from "src/achievement/achievement";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";
import { Response } from "express";
import { createReadStream } from "fs";
import { join } from "path";
import { Readable } from "typeorm/platform/PlatformTools";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly avatarService: AvatarService,
    private readonly achievementService: AchievementService,
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

  async findUserByPlayerName(playerName: string) {
    const foundUser = await this.userRepository.findOneBy({
      playerName: playerName,
    });
    return foundUser;
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

  // async findUserByPlayerName(playerName: string) {
  //   const foundUser = this.userRepository.findOne({
  //     where: {
  //       playerName: playerName,
  //     },
  //     select: {
  //       id: true,
  //       playerName: true,
  //     },
  //   });

  //   return foundUser;
  // }

  async deleteUser(id: number) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException("User not found");
    }
  }

  async updateUser(id: number, settings: UpdateUserSettingsDto) {
    this.logger.log("Hit the updateUser route");
    if (settings.twoFAEnabled)
      await this.addAchievement(id, Achievements.TWOFA);
    if (await this.checkPlayerNameAchievement(id, settings.playerName))
      await this.addAchievement(id, Achievements.NAME);
    return await this.userRepository.update(id, settings);
  }

  async updateUserStatus(
    userId: number,
    updateUserStatusDto: UpdateUserStatusDto,
  ) {
    this.logger.log("Hit the updateUserStatus route");
    const user = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        status: updateUserStatusDto.status,
      })
      .where("id = :id", { id: userId })
      .execute();
    return user;
  }

  /*********
   * avatar *
   *********/

  async addAvatar(id: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.avatarService.uploadAvatar(imageBuffer, filename);
    await this.userRepository.update(id, {
      avatarId: avatar.id,
    });
    return avatar;
  }

  async getDefaultAvatar(res: Response) {
    res.header("Content-Type", "image");
    res.header("Content-Disposition", `inline; filename="default-avatar.jpg"`);
    const defaultAvatar = createReadStream(
      join(process.cwd(), "src/assets/default-avatar.png"),
    );
    return new StreamableFile(defaultAvatar);
  }

  async getAvatarById(id: number, res: Response) {
    const file = await this.avatarService.getAvatarById(id);
    res.header("Content-Type", "image");
    res.header("Content-Disposition", `inline; filename="${file.filename}"`);
    if (file.data) {
      const stream = Readable.from(file.data);
      return new StreamableFile(stream);
    }
  }

  async setTwoFactorSecret(id: number, secret: string) {
    return this.userRepository.update(id, { twoFASecret: secret });
  }

  /* achievements */

  async addAchievement(userId: number, achievementId: number) {
    this.logger.log("Hit the addAchievement route");
    await this.achievementService.addSingleAchievement(achievementId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["achievements"],
    });
    if (user) {
      if (
        user.achievements.find(
          (achievement: Achievement) => achievement.id === achievementId,
        )
      ) {
        this.logger.log("Achievement does already exist");
        return;
      }
      const achievement = await this.achievementService.getAchievementById(
        achievementId,
      );
      if (achievement) {
        user.achievements.push(achievement);
        this.logger.log("Achievement added");
        return await this.userRepository.save(user);
      }
    } else this.logger.debug("User not found");
  }

  async getAchievements(userId: number) {
    this.logger.log("Hit the getAchievements route");
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["achievements"],
    });
    if (user) {
      return user.achievements;
    }
  }

  async checkPlayerNameAchievement(id: number, playerName: string) {
    const user = await this.findUserById(id);
    if (user) {
      if (user.playerName === null || user.playerName === playerName) return 0;
    }
    return 1;
  }
}
