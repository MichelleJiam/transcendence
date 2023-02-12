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
    console.log(client.id, " connected");
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, " disconnected");
  }

  @SubscribeMessage("joinRoom")
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameRoom: GameRoom,
  ) {
    if (gameRoom.player == 1) {
      gameRoom.playerOne.socket = client.id;
      await this.gameService.updateSocket(gameRoom);
    } else {
      gameRoom.playerTwo.socket = client.id;
      await this.gameService.updateSocket(gameRoom);
    }
    client.join(gameRoom.id);
    console.log(client.id, " joined room: ", client.rooms);
    if (gameRoom.player == 2) {
      this.server.emit("addPlayerOne", gameRoom);
    }
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() gameId: string) {
    client.leave(gameId);
    console.log(client.id, " left room: ", gameId);
  }

  @SubscribeMessage("movePaddleUp")
  movePaddleUp(@MessageBody() gameRoom: GameRoom) {
    this.server.to(gameRoom.id).emit("movePaddleUp", gameRoom.player);
  }

  @SubscribeMessage("movePaddleDown")
  movePaddleDown(@MessageBody() gameRoom: GameRoom) {
    this.server.to(gameRoom.id).emit("movePaddleDown", gameRoom.player);
  }

  @SubscribeMessage("moveBall")
  moveBall(@MessageBody() room: string) {
    this.server.to(room).emit("calculateBallMovement");
  }

  @SubscribeMessage("endGame")
  endGame(@MessageBody() gameRoom: GameRoom) {
    this.server.to(gameRoom.id).emit("endGame", gameRoom);
  }
}
