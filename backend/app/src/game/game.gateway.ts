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
  intervalId!: ReturnType<typeof setInterval>;
  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(client.id, " connected");
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, " disconnected");
  }

  @SubscribeMessage("countdown")
  countdown(@MessageBody() gameRoom: GameRoom) {
    let count = 3;
    const timeout = setInterval(() => {
      this.server.to(gameRoom.id).emit("drawCountdown", count);
      if (count < 0) {
        clearInterval(timeout);
        this.intervalId = setInterval(() => {
          this.server.to(gameRoom.id).emit("drawCanvas");
          // this.moveBall(gameRoom);
        }, 8);
      }
      count--;
    }, 750);
  }

  @SubscribeMessage("drawScoreboard")
  drawScoreboard(
    @ConnectedSocket() client: Socket,
    @MessageBody() winnerGame: GameRoom,
  ) {
    this.server
      .to(winnerGame.id)
      .emit(
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
    @MessageBody() gameRoom: GameRoom,
  ) {
    client.join(gameRoom.id);
    console.log(
      client.id,
      " joined room ",
      gameRoom.id,
      " as WATCHER",
      client.rooms,
    );
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

  @SubscribeMessage("endMatch")
  endMatch() {
    clearInterval(this.intervalId);
  }

  // moveBall(gameRoom: GameRoom) {
  //   const x = gameRoom.ball.x / gameRoom.view.width;
  //   const y = gameRoom.ball.y / gameRoom.view.height;

  //   if (
  //     x * gameRoom.view.width + gameRoom.ball.moveX >
  //     gameRoom.view.width -
  //       gameRoom.ball.radius -
  //       gameRoom.playerTwo.paddle.width * 2 -
  //       gameRoom.playerTwo.paddle.offset
  //   ) {
  //     if (
  //       y * gameRoom.view.height >
  //         gameRoom.playerTwo.paddle.y - gameRoom.ball.radius &&
  //       gameRoom.ball.y <
  //         gameRoom.playerTwo.paddle.y +
  //           gameRoom.playerTwo.paddle.height +
  //           gameRoom.ball.radius
  //     ) {
  //       gameRoom.ball.moveX = -gameRoom.ball.moveX;
  //     } else {
  //       gameRoom.ball.moveX = -gameRoom.ball.moveX;
  //       gameRoom.winner = 1;
  //       console.log("endMatch");
  //       // return this.endMatch(gameRoom);
  //     }
  //   } else if (
  //     x * gameRoom.view.width + gameRoom.ball.moveX <
  //     gameRoom.ball.radius +
  //       gameRoom.playerTwo.paddle.width +
  //       gameRoom.playerTwo.paddle.offset
  //   ) {
  //     if (
  //       y * gameRoom.view.height >
  //         gameRoom.playerOne.paddle.y - gameRoom.ball.radius &&
  //       y * gameRoom.view.height <
  //         gameRoom.playerOne.paddle.y +
  //           gameRoom.playerOne.paddle.height +
  //           gameRoom.ball.radius
  //     ) {
  //       gameRoom.ball.moveX = -gameRoom.ball.moveX;
  //     } else {
  //       gameRoom.ball.moveX = -gameRoom.ball.moveX;
  //       gameRoom.winner = 2;
  //       console.log("endMatch");
  //       // return this.endMatch(gameRoom);
  //     }
  //   }
  //   if (
  //     y * gameRoom.view.height + gameRoom.ball.moveY <
  //     gameRoom.ball.radius + gameRoom.view.offset - gameRoom.view.borderLines
  //   ) {
  //     gameRoom.ball.moveY = -gameRoom.ball.moveY;
  //   } else if (
  //     y * gameRoom.view.height + gameRoom.ball.moveY >
  //     gameRoom.view.height - gameRoom.ball.radius - gameRoom.view.offset
  //   ) {
  //     gameRoom.ball.moveY = -gameRoom.ball.moveY;
  //   }
  //   gameRoom.ball.x += gameRoom.ball.moveX;
  //   gameRoom.ball.y += gameRoom.ball.moveY;
  //   this.server
  //     .to(gameRoom.id)
  //     .emit(
  //       "drawBall",
  //       gameRoom.ball.x / gameRoom.view.width,
  //       gameRoom.ball.y / gameRoom.view.height,
  //     );
  // }
}
