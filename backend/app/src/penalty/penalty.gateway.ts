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
import { PenaltyService } from "./penalty.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
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

  @SubscribeMessage("checkBan")
  async checkBan(client: Socket, payload: CreatePenaltyDto): Promise<void> {
    try {
      this.server.emit("gotBanned", payload);
    } catch (err) {
      console.log(err);
    }
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
