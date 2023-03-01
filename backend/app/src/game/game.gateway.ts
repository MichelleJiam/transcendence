import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Game } from "./entities/game.entity";
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
  map = new Map<string, ReturnType<typeof setInterval>>();
  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log("GameGateway: ", client.id, " connected");
  }

  async handleDisconnect(client: Socket) {
    console.log("GameGateway: ", client.id, " disconnected");
    const leftGame = await this.gameService.findGameFromPlayerSocket(client.id);
    if (leftGame != null) {
      this.playerLeft(leftGame);
    }
  }

  @SubscribeMessage("drawGame")
  drawGame(@MessageBody() gameRoom: GameRoom) {
    this.server.to(gameRoom.id).emit("drawcanvas");
  }

  @SubscribeMessage("countdown")
  async countdown(@MessageBody() gameRoom: GameRoom) {
    let count = 3;
    const timeout = setInterval(() => {
      console.log("gameRoom.player ", gameRoom.player, " count ", count);
      this.server.to(gameRoom.id).emit("drawCountdown", count);
      if (count < 0) {
        clearInterval(timeout);
        this.map.set(
          gameRoom.id,
          setInterval(async () => {
            this.server.to(gameRoom.id).emit("drawCanvas");
            // this.moveBall(gameRoom);
          }, 8),
        );
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

  @SubscribeMessage("leftGamePage")
  async playerLeft(@MessageBody() gameRoom: GameRoom) {
    console.log("A player left the game");
    console.log("Game state: ", gameRoom.state);
  }

  @SubscribeMessage("endGame")
  async endGame(@MessageBody() gameRoom: GameRoom) {
    console.log("endGame");
    this.server.to(gameRoom.id).emit("endGame", gameRoom);
  }

  async endMatch(gameRoom: GameRoom) {
    if (gameRoom.winner == 1) gameRoom.playerOne.score++;
    else gameRoom.playerTwo.score++;
    this.server
      .to(gameRoom.id)
      .emit("updateScore", gameRoom.playerOne.score, gameRoom.playerTwo.score);
    if (gameRoom.playerOne.score === 3 || gameRoom.playerTwo.score === 3) {
      await this.endGame(gameRoom);
    } else {
      if (gameRoom.winner == 1)
        this.server.to(gameRoom.id).emit("resetBall", 1);
      else this.server.to(gameRoom.id).emit("resetBall", -1);
    }
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() gameId: string) {
    client.leave(gameId);
    console.log(client.id, " left room: ", gameId);
  }

  // async moveBall(gameRoom: GameRoom) {
  @SubscribeMessage("moveBall")
  moveBall(@MessageBody() gameRoom: GameRoom) {
    const x = gameRoom.ball.x / gameRoom.view.width;
    const y = gameRoom.ball.y / gameRoom.view.height;

    if (
      x * gameRoom.view.width + gameRoom.ball.moveX >
      gameRoom.view.width -
        gameRoom.ball.radius -
        gameRoom.playerTwo.paddle.width * 2 - // why * 2 here but not line 218?
        gameRoom.playerTwo.paddle.offset
    ) {
      if (
        y * gameRoom.view.height >
          gameRoom.playerTwo.paddle.y - gameRoom.ball.radius &&
        gameRoom.ball.y <
          gameRoom.playerTwo.paddle.y +
            gameRoom.playerTwo.paddle.height +
            gameRoom.ball.radius
      ) {
        gameRoom.ball.moveX = -gameRoom.ball.moveX;
      } else {
        gameRoom.ball.moveX = -gameRoom.ball.moveX;
        gameRoom.winner = 1;
        clearInterval(this.map.get(gameRoom.id));
        this.map.delete(gameRoom.id);
        this.endMatch(gameRoom);
        return;
      }
    } else if (
      x * gameRoom.view.width + gameRoom.ball.moveX <
      gameRoom.ball.radius +
        gameRoom.playerTwo.paddle.width +
        gameRoom.playerTwo.paddle.offset
    ) {
      if (
        y * gameRoom.view.height >
          gameRoom.playerOne.paddle.y - gameRoom.ball.radius &&
        y * gameRoom.view.height <
          gameRoom.playerOne.paddle.y +
            gameRoom.playerOne.paddle.height +
            gameRoom.ball.radius
      ) {
        gameRoom.ball.moveX = -gameRoom.ball.moveX;
      } else {
        gameRoom.ball.moveX = -gameRoom.ball.moveX;
        gameRoom.winner = 2;
        clearInterval(this.map.get(gameRoom.id));
        this.map.delete(gameRoom.id);
        this.endMatch(gameRoom);
        return;
      }
    }
    if (
      y * gameRoom.view.height + gameRoom.ball.moveY <
      gameRoom.ball.radius + gameRoom.view.offset - gameRoom.view.borderLines
    ) {
      gameRoom.ball.moveY = -gameRoom.ball.moveY;
    } else if (
      y * gameRoom.view.height + gameRoom.ball.moveY >
      gameRoom.view.height - gameRoom.ball.radius - gameRoom.view.offset
    ) {
      gameRoom.ball.moveY = -gameRoom.ball.moveY;
    }
    gameRoom.ball.x += gameRoom.ball.moveX;
    gameRoom.ball.y += gameRoom.ball.moveY;
    this.server
      .to(gameRoom.id)
      .emit(
        "drawBall",
        gameRoom.ball.x / gameRoom.view.width,
        gameRoom.ball.y / gameRoom.view.height,
        gameRoom.ball.moveX,
        gameRoom.ball.moveY,
      );
  }
}
