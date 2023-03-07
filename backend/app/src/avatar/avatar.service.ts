import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Avatar } from "./avatar.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);

  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}

  async uploadAvatar(dataBuffer: Buffer, filename: string) {
    this.logger.log("Hit the uploadAvatar route");
    const newFile = this.avatarRepository.create({
      filename,
      data: dataBuffer,
    });
    await this.avatarRepository.save(newFile);
    return newFile;
  }

  async getAvatarById(id: number) {
    this.logger.log("Hit the getAvatarById route");
    const file = await this.avatarRepository.findOne({ where: { id: id } });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async deleteAvatarById(id: number) {
    this.logger.log("Hit the deleteAvatarById route");
    return await this.avatarRepository.delete(id);
  }
}
