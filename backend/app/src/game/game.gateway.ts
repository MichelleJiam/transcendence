import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { Ball } from "./pong.types";

// by default will listen to same port http is listening on
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "pong",
})
export class GameGateway {
  @WebSocketServer() /* tell NestJS to inject the WebSocket server */
  server!: Server; /* reference to socket.io server under the hood */
  constructor(private readonly gameService: GameService) {}

  ballPos: Ball = {};

  handleConnection(client: Socket) {
    console.log(client.id + " connected");
  }

  handleDisconnect(client: Socket) {
    console.log(client.id + " disconnected");
  }

  @SubscribeMessage("joinRoom")
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.join(room);
    console.log(client.id, " joined room: ", room);
    this.server.emit("addPlayerOne", room);
  }

  @SubscribeMessage("ballPosition")
  async ballPosition(
    @ConnectedSocket() client: Socket,
    @MessageBody() ball: Ball,
  ) {
    this.ballPos.x = ball.x;
    this.ballPos.y = ball.y;
    this.ballPos.moveX = ball.moveX;
    this.ballPos.moveY = ball.moveY;
  }
}
