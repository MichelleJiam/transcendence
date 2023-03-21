import { forwardRef, Inject } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
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
    console.debug(client.id + " connected friend socket");
  }

  handleDisconnect(client: Socket) {
    console.debug(client.id + " disconnected friend socket");
  }
}
