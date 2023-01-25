import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Blocklist } from "./blocklist.entity";

@Injectable()
export class BlocklistService {
  constructor(
    @InjectRepository(Blocklist)
    private readonly blocklistRepository: Repository<Blocklist>,
  ) {}

  async getGlobalBlocklist() {
    return await this.blocklistRepository.find({
      relations: {
        blockedUser: true,
        blocklistOwner: true,
      },
      order: {
        blocklistOwner: {
          id: "asc",
        },
      },
    });
  }

  async getBlockedUsersForUser(userId: number) {
    const blockedUsers = await this.blocklistRepository.find({
      relations: {
        blocklistOwner: true,
        blockedUser: true,
      },
      where: {
        blocklistOwner: {
          id: userId,
        },
      },
    });
    return blockedUsers;
  }

  async createBlockEntryForUser(
    blocklistOwner: User,
    blockedUser: User,
  ): Promise<Blocklist> {
    const blockEntry = new Blocklist();
    blockEntry.blocklistOwner = blocklistOwner;
    blockEntry.blockedUser = blockedUser;

    return await this.blocklistRepository.save(blockEntry);
  }

  async deleteBlockEntry(
    blocklistOwner: number,
    blockedUser: number,
  ): Promise<void> {
    const user = await this.blocklistRepository.findOne({
      relations: {
        blocklistOwner: true,
        blockedUser: true,
      },
      where: {
        blocklistOwner: {
          id: blocklistOwner,
        },
        blockedUser: {
          id: blockedUser,
        },
      },
    });
    if (user) {
      this.blocklistRepository.delete(user.id);
    }
  }
}
