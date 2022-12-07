import { Injectable, NotFoundException } from "@nestjs/common";
import { Avatar } from "./avatar.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AvatarService {
	constructor(
		@InjectRepository(Avatar)
		private readonly avatarRepository: Repository<Avatar>
	) {}

	getAvatar(id: number) {
		return "hello from getAvatar() in avatar!";
	}

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
}
