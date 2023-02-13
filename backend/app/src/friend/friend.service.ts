import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Friend } from "./friend.entity";
import { FriendGateway } from "./friend.gateway";

type Relation = {
  source: number;
  target: number;
  status: string /* FRIEND | PENDING | NONE */;
};

@Injectable()
export class FriendService {
  private readonly logger = new Logger(FriendService.name);

  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @Inject(forwardRef(() => FriendGateway))
    private readonly friendGateway: FriendGateway,
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

  async checkRequest(source: number, target: number) {
    if (source == target) {
      this.logger.debug("Source is equal to target");
      throw new BadRequestException();
    } else if ((await this.getSingleRelation(source, target)).length > 0) {
      this.logger.debug("Existing relation");
      throw new BadRequestException();
    }
  }

  async friendRequest(input: object) {
    await this.friendRepository.save(input);
    return this.friendGateway.server.emit("friendRequest", input);
  }

  async acceptRequest(input: Relation) {
    await this.friendRepository.update(
      {
        source: input.source,
        target: input.target,
      },
      { status: "FRIEND" },
    );
    return this.friendGateway.server.emit("requestAccepted", input);
  }

  async unfriend(input: Relation) {
    await this.friendRepository.delete({
      source: input.source,
      target: input.target,
    });
    return this.friendGateway.server.emit("unfriend", input);
  }
}
