import { Injectable, Logger } from "@nestjs/common";
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

  async getFriendsForUser(id: number) {
    const relations = await this.friendRepository.find({
      where: [
        { source: id, status: "FRIEND" }, // target is friend
        { target: id, status: "FRIEND" }, // source is friend
      ],
      relations: ["source", "target"],
    });
    const friends = relations.map((relation: Friend) => {
      if ((relation.source as unknown as User).id == id) return relation.target;
      else return relation.source;
    });
    return friends;
  }

  friendRequest(input: object) {
    return this.friendRepository.save(input);
  }
}

// const relations = await this.friendRepository
// .createQueryBuilder("f")
// .leftJoinAndSelect("f.source", "s")
// .leftJoinAndSelect("f.target", "t")
// .where("s.id = :id OR t.id = :id", { id })
// .getMany();
