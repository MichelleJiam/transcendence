import { Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import { Avatar } from "./avatar.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Response } from "express";
import { createReadStream } from "fs";
import { join } from "path";
import { Readable } from "typeorm/platform/PlatformTools";

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}

  async uploadAvatar(dataBuffer: Buffer, filename: string) {
    const newFile = await this.avatarRepository.create({
      filename,
      data: dataBuffer,
    });
    await this.avatarRepository.save(newFile);
    return newFile;
  }

  async getAvatarById(id: number) {
    const file = await this.avatarRepository.findOne({ where: { id: id } });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async deleteAvatar(id: number) {
    await this.avatarRepository.delete(id);
  }

  getDefaultAvatar(res: Response) {
    res.header("Content-Type", "image");
    res.header("Content-Disposition", `inline; filename="default-avatar.jpg"`);
    const defaultAvatar = createReadStream(
      join(process.cwd(), "src/assets/default-avatar.png"),
    );
    return new StreamableFile(defaultAvatar);
  }

  async getAvatar(avatarId: number, res: Response) {
    const file = await this.getAvatarById(avatarId);
    res.header("Content-Type", "image");
    res.header("Content-Disposition", `inline; filename="${file.filename}"`);
    if (file.data) {
      const stream = Readable.from(file.data);
      return new StreamableFile(stream);
    }
  }
}
