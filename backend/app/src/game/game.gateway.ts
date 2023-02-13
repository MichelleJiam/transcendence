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

  @SubscribeMessage("countdown")
  async countdown(
    @ConnectedSocket() client: Socket,
    @MessageBody() count: number,
  ) {
    this.server.emit("drawCount", count);
  }

  @SubscribeMessage("drawScoreboard")
  drawScoreboard(
    @ConnectedSocket() client: Socket,
    @MessageBody() winnerGame: GameRoom,
  ) {
    this.server.emit(
      "drawScoreboard",
      winnerGame.playerOne.score,
      winnerGame.playerTwo.score,
      winnerGame.winner,
    );
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

  @SubscribeMessage("updateActiveGames")
  async updateActiveGames() {
    this.server.emit("updateActiveGames");
  }

  @SubscribeMessage("watchGame")
  async watchGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: number,
  ) {
    client.join(room.toString());
    console.log(client.id, " joined room ", room, " as WATCHER");
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() gameId: string) {
    client.leave(gameId);
    console.log(client.id, " left room: ", gameId);
  }

  @SubscribeMessage("movePaddleUp")
  movePaddleUp(@MessageBody() gameRoom: GameRoom) {
    let y: number;
    if (gameRoom.player == 1) {
      y =
        Math.max(
          gameRoom.playerOne.paddle.y - gameRoom.view.height * 0.015,
          gameRoom.view.offset + gameRoom.view.borderLines,
        ) / gameRoom.view.height;
      this.server.to(gameRoom.id).emit("movePaddleOneUp", y);
    } else {
      y =
        Math.max(
          gameRoom.playerTwo.paddle.y - gameRoom.view.height * 0.015,
          gameRoom.view.offset + gameRoom.view.borderLines,
        ) / gameRoom.view.height;
      this.server.to(gameRoom.id).emit("movePaddleTwoUp", y);
    }
  }

  @SubscribeMessage("movePaddleDown")
  movePaddleDown(@MessageBody() gameRoom: GameRoom) {
    let y: number;
    if (gameRoom.player == 1) {
      y =
        Math.min(
          gameRoom.playerOne.paddle.y + gameRoom.view.height * 0.015,
          gameRoom.view.height -
            gameRoom.playerOne.paddle.height -
            gameRoom.view.offset -
            gameRoom.view.borderLines,
        ) / gameRoom.view.height;
      this.server.to(gameRoom.id).emit("movePaddleOneDown", y);
    } else {
      y =
        Math.min(
          gameRoom.playerTwo.paddle.y + gameRoom.view.height * 0.015,
          gameRoom.view.height -
            gameRoom.playerTwo.paddle.height -
            gameRoom.view.offset -
            gameRoom.view.borderLines,
        ) / gameRoom.view.height;
      this.server.to(gameRoom.id).emit("movePaddleTwoDown", y);
    }
  }

  @SubscribeMessage("moveBall")
  moveBall(@MessageBody() gameRoom: GameRoom) {
    const x = gameRoom.ball.x / gameRoom.view.width;
    const y = gameRoom.ball.y / gameRoom.view.height;
    this.server.to(gameRoom.id).emit("calculateBallMovement", x, y);
  }

  @SubscribeMessage("endGame")
  endGame(@MessageBody() gameRoom: GameRoom) {
    this.server.to(gameRoom.id).emit("endGame", gameRoom);
  }
}
