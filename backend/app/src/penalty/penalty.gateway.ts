import { forwardRef, Inject } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";

import { Socket, Server } from "socket.io";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { KickedAUserDto } from "./dto/kicked-a-user.dto";
import { PenaltyService } from "./penalty.service";

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
  },
  namespace: "penalty",
})
export class PenaltyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(forwardRef(() => PenaltyService))
    private readonly penaltyService: PenaltyService,
  ) {}

  @SubscribeMessage("newUserState")
  async joinedChat(client: Socket, chatroomId: number) {
    this.server.emit("userUpdate", chatroomId);
  }

  @SubscribeMessage("checkBan")
  async checkBan(client: Socket, payload: CreatePenaltyDto): Promise<void> {
    try {
      console.log(payload);
      this.server.emit("gotBanned", payload);
    } catch (err) {
      console.error(err);
    }
  }

  @SubscribeMessage("kickUser")
  async handleKick(client: Socket, payload: KickedAUserDto) {
    this.server.emit("kickedAUser", payload);
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
  }
}
