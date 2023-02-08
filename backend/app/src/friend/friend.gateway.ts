import { forwardRef, Inject } from "@nestjs/common";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { CreateRelationDto, Relation } from "./dto/create-relation.dto";
import { FriendService } from "./friend.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "friend",
})
export class FriendGateway {
  @WebSocketServer()
  server!: Server;
  constructor(
    @Inject(forwardRef(() => FriendService))
    private readonly friendService: FriendService,
  ) {}

  handleConnection(client: Socket) {
    console.log(client.id + " connected friend socket");
  }

  handleDisconnect(client: Socket) {
    console.log(client.id + " disconnected friend socket");
  }

  @SubscribeMessage("friendRequest")
  async friendRequest(@MessageBody() input: CreateRelationDto) {
    console.log("friendRequest function with input: ", input);
    this.server.emit("FriendRequestPending", input);
  }

  @SubscribeMessage("requestAccepted")
  async requestAccepted(@MessageBody() input: Relation) {
    console.log("requestAccepted function with input: ", input);
    this.server.emit("FriendRequestPending", input);
  }
}
