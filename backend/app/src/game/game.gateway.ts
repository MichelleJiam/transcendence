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
import { CreateGameDto } from "./dto/create-game.dto";

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
    console.log(client.id, " connected");
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, " disconnected");
  }

  @SubscribeMessage("joinRoom")
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() game: CreateGameDto,
  ) {
    client.join(game.id.toString());
    console.log(client.id, " joined room: ", client.rooms);
    this.server.emit("addPlayerOne", game);
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() gameId: string) {
    client.leave(gameId);
    console.log(client.id, " left room: ", gameId);
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

  @SubscribeMessage("endGame")
  endGame(@MessageBody() gameRoom: GameRoom) {
    this.server.to(gameRoom.room).emit("endGame", gameRoom);
  }
}
