import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { GameService } from "./game.service";
import { CreateSocketDto } from "./dto/create-socket.dto";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

// by default will listen to same port http is listening on
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  // namespace: "pong", FIGURE OUT HOW THIS WORKS
})
export class GameGateway {
  @WebSocketServer() // tell NestJS to inject the WebSocket server
  server!: Server; // reference to socket.io server under the hood
  constructor(private readonly socketService: GameService) {}

  //  paddle1!: number;
  //  paddle2!: number;

  @SubscribeMessage("findAllMessages")
  async hello(@ConnectedSocket() client: Socket) {
    console.log("client id from backend: " + client.id);
  }

  handleConnection(client: Socket) {
    console.log(client.id + " connected");
  }

  handleDisconnect(client: Socket) {
    console.log(client.id + " disconnected");
  }
  @SubscribeMessage("createMessage")
  async create(
    @MessageBody() createSocketDto: CreateSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.socketService.create(createSocketDto, client.id);
    this.server.emit("message", message);
    return message;
  }

  @SubscribeMessage("findAllMessages")
  findAll() {
    return this.socketService.findAllMessages();
  }

  @SubscribeMessage("join")
  joinRoom(
    @MessageBody("name") name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.socketService.identify(name, client.id);
  }

  @SubscribeMessage("typing")
  async typing(
    @MessageBody("isTyping") isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.socketService.getClientName(client.id);
    (client as any).broadcast.emit("typing", { name, isTyping });
  }
}
