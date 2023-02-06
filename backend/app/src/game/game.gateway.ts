import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { GameRoom } from "./pong.types";

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

  @SubscribeMessage("movePaddleUp")
  movePaddleUp(@MessageBody() gameRoom: GameRoom) {
    this.server.to(gameRoom.room).emit("movePaddleUp", gameRoom.player);
  }

  @SubscribeMessage("movePaddleDown")
  movePaddleDown(@MessageBody() gameRoom: GameRoom) {
    this.server.to(gameRoom.room).emit("movePaddleDown", gameRoom.player);
  }

  @SubscribeMessage("moveBall")
  moveBall(@MessageBody() room: string) {
    this.server.to(room).emit("calculateBallMovement");
  }
}
