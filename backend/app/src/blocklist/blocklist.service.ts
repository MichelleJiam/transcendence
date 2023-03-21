import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { Blocklist } from "./blocklist.entity";
import { CreateBlockDto } from "./dto/create-block.dto";
import { DeleteBlockDto } from "./dto/delete-block.dto";

@Injectable()
export class BlocklistService {
  constructor(
    @InjectRepository(Blocklist)
    private readonly blocklistRepository: Repository<Blocklist>,
    private readonly userService: UserService,
  ) {}

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
      select: {
        blocklistOwner: {
          id: true,
          playerName: true,
        },
        blockedUser: {
          id: true,
          playerName: true,
        },
      },
      cache: true,
    });
    return blockedUsers;
  }

  async createBlockEntryForUser(
    createBlockDto: CreateBlockDto,
  ): Promise<Blocklist | undefined> {
    console.log(createBlockDto);
    const owner = await this.userService.findUserById(
      createBlockDto.blocklistOwner,
    );
    const blocked = await this.userService.findUserById(
      createBlockDto.blockedUser,
    );
    if (owner !== null && blocked !== null) {
      const blockEntry = new Blocklist();
      blockEntry.blocklistOwner = owner;
      blockEntry.blockedUser = blocked;

      return await this.blocklistRepository.save(blockEntry);
    }
  }

  async deleteBlockEntry(deleteBlockDto: DeleteBlockDto): Promise<void> {
    const user = await this.blocklistRepository.findOne({
      relations: {
        blocklistOwner: true,
        blockedUser: true,
      },
      where: {
        blocklistOwner: {
          id: deleteBlockDto.blocklistOwner,
        },
        blockedUser: {
          id: deleteBlockDto.blockedUser,
        },
      },
      select: {
        blocklistOwner: {
          id: true,
          playerName: true,
        },
        blockedUser: {
          id: true,
          playerName: true,
        },
      },
      cache: true,
    });
    if (user) {
      this.blocklistRepository.delete(user.id);
    }
  }
}
