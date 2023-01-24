import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Friend } from "./friend.entity";

@Injectable()
export class FriendService {
  private readonly logger = new Logger(FriendService.name);

  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}

  getAllRelations() {
    return this.friendRepository.find();
  }

  async getSingleRelation(source: number, target: number) {
    const relation = await this.friendRepository.find({
      where: [
        { source: source, target: target },
        { source: target, target: source },
      ],
      relations: ["source", "target"],
    });
    return relation;
  }

  async getFriendsForUser(id: number) {
    const relations = await this.friendRepository.find({
      where: [
        { source: id, status: "FRIEND" },
        { target: id, status: "FRIEND" },
      ],
      relations: ["source", "target"],
    });
    const friends = relations.map((relation: Friend) => {
      if ((relation.source as unknown as User).id == id) return relation.target;
      else return relation.source;
    });
    return friends;
  }

  async checkRequest(source: number, target: number) {
    if (source == target) {
      this.logger.debug("Source is equal to target");
      throw new BadRequestException();
    } else if ((await this.getSingleRelation(source, target)).length > 0) {
      this.logger.debug("Existing relation");
      throw new BadRequestException();
    }
  }

  friendRequest(input: object) {
    return this.friendRepository.save(input);
  }
}
