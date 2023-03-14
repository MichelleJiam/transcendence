import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MatchService } from "src/match/match.service";
import { UserService } from "src/user/user.service";
import { GameService } from "./game.service";
import { GameRoom, GameWithPlayer } from "./pong.types";

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
  countdownMap = new Map<string, ReturnType<typeof setInterval>>();

  STATE = {
    READY: 0,
    WAITING: 1,
    PLAYING: 2,
  };

  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly matchService: MatchService,
  ) {}

  handleConnection(client: Socket) {
    console.log("GameGateway: ", client.id, " connected");
  }

  // Triggered on window close or refresh.
  // No need to leave rooms as sockets leave all the channels they were part
  // of automatically on disconnection.
  async handleDisconnect(client: Socket) {
    console.log("GameGateway: ", client.id, " disconnected"); // socket id here not same as when joining? find doesn't return anything then
    const leftGame: GameWithPlayer =
      await this.gameService.findGameFromPlayerSocket(client.id);
    if (leftGame.game !== null) {
      console.log(
        "Player ",
        leftGame.playerId,
        " left game ",
        leftGame.game?.id,
      );
      this.server.emit("playerForfeited", leftGame.playerNum);
      this.cleanUpOnPlayerDisconnect(leftGame);
    } else {
      console.log("No active games being played were left");
      this.checkMatchQueueOnDisconnect(client.id);
      this.server.emit("disconnection");
    }
  }

  @SubscribeMessage("updateActiveGames")
  updateActiveGames() {
    this.server.emit("updateActiveGames");
  }

  /**************
   * GAME START *
   **************/

  @SubscribeMessage("watchGame")
  watchGame(
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
    console.log(
      client.id,
      " joined room: ",
      client.rooms,
      " as player ",
      gameRoom.player,
    );
    if (gameRoom.player === 2 && gameRoom.state === this.STATE.READY) {
      this.server.emit("addPlayerOne", gameRoom);
    } else if (gameRoom.player === 1) {
      this.updateActiveGames();
      this.server.to(gameRoom.id).emit("savePlayerSockets", gameRoom);
    }
  }

  @SubscribeMessage("countdown")
  async countdown(@MessageBody() gameRoom: GameRoom) {
    let count = 3;
    this.countdownMap.set(
      gameRoom.id,
      setInterval(() => {
        this.server.to(gameRoom.id).emit("drawCountdown", count);
        console.log(gameRoom.player, ": count ", count);
        if (count < 0) {
          clearInterval(this.countdownMap.get(gameRoom.id));
          this.map.set(
            gameRoom.id,
            setInterval(() => {
              this.server.to(gameRoom.id).emit("drawCanvas");
            }, 8),
          );
        }
        count--;
      }, 750),
    );
  }

  /************
   * GAME END *
   ************/

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

  async checkScore(gameRoom: GameRoom) {
    clearInterval(this.map.get(gameRoom.id));
    this.map.delete(gameRoom.id);
    if (gameRoom.winner == 1) gameRoom.playerOne.score++;
    else gameRoom.playerTwo.score++;
    this.server
      .to(gameRoom.id)
      .emit("updateScore", gameRoom.playerOne.score, gameRoom.playerTwo.score);
    if (gameRoom.playerOne.score === 3 || gameRoom.playerTwo.score === 3) {
      await this.endGame(gameRoom.id, gameRoom.winner);
    } else {
      this.server.to(gameRoom.id).emit("resetBall", gameRoom.ball.moveX);
    }
  }

  @SubscribeMessage("endGame")
  async endGame(@MessageBody() gameRoomId: string, winner: number) {
    this.server.to(gameRoomId).emit("endGame", winner);
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() gameId: string) {
    client.leave(gameId);
    console.log("GameGateway | ", client.id, " left room ", gameId);
    this.updateActiveGames();
  }

  /*****************
   * DISCONNECTION *
   *****************/

  @SubscribeMessage("forfeitGame")
  async forfeitGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameRoom: GameRoom,
  ) {
    console.log("Forfeiting game");
    clearInterval(this.map.get(gameRoom.id));
    clearInterval(this.countdownMap.get(gameRoom.id));
    this.map.delete(gameRoom.id);
    if (this.gameService.bothPlayersDisconnected(gameRoom)) {
      console.log("Both players disconnected");
      this.gameService.remove(Number(gameRoom.id));
    } else {
      this.gameService.setForfeitScoreWinner(gameRoom);
      this.server
        .to(gameRoom.id)
        .emit(
          "updateScore",
          gameRoom.playerOne.score,
          gameRoom.playerTwo.score,
        );
      this.endGame(gameRoom.id, gameRoom.winner);
    }
  }

  @SubscribeMessage("activeGameLeft")
  async activeGameLeft(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameRoom: GameRoom,
  ) {
    if (gameRoom.player === 0) {
      console.log("A watcher left");
    } else {
      console.log("A player left game: ", gameRoom.id);
      const disconnectedPlayer =
        gameRoom.playerOne.socket === client.id ? 1 : 2;
      this.server.emit("playerForfeited", disconnectedPlayer);
    }
    // this.leaveRoom(client, gameRoom.id);
  }

  async cleanUpOnPlayerDisconnect(leftGame: GameWithPlayer) {
    // updates active game list on disconnecting player side
    if (leftGame.game) {
      this.gameService.setGameToDone(leftGame.game.id);
    }

    // updates active game list on lobby user
    await this.updateActiveGames();

    // reset disconnected user status back to online
    if (leftGame.playerId) {
      await this.userService.updateUserStatus(leftGame.playerId, {
        status: 0,
      });
    }
  }

  async checkMatchQueueOnDisconnect(socketId: string) {
    // console.log("Checking if player socket ", socketId, " was in queue");
    const leftMatch = await this.matchService.findPlayerInMatchQueueBySocket(
      socketId,
    );
    if (leftMatch) {
      await this.matchService.remove(leftMatch.playerId);
    }
  }

  /************
   * MOVEMENT *
   ************/

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
  async moveBall(@MessageBody() gameRoom: GameRoom) {
    if (
      gameRoom.ball.x + gameRoom.ball.moveX >
      gameRoom.view.width -
        gameRoom.playerTwo.paddle.width -
        gameRoom.playerTwo.paddle.offset -
        gameRoom.ball.radius * 2
    ) {
      if (
        gameRoom.ball.y > gameRoom.playerTwo.paddle.y - gameRoom.ball.radius &&
        gameRoom.ball.y <
          gameRoom.playerTwo.paddle.y +
            gameRoom.playerTwo.paddle.height +
            gameRoom.ball.radius
      ) {
        // console.log("right paddle hit");
        gameRoom.ball.moveX = -gameRoom.ball.moveX;
      } else {
        // console.log("right side hit");
        gameRoom.winner = 1;
        return await this.checkScore(gameRoom);
      }
    } else if (
      gameRoom.ball.x + gameRoom.ball.moveX <
      gameRoom.ball.radius +
        gameRoom.playerTwo.paddle.width +
        gameRoom.playerTwo.paddle.offset
    ) {
      if (
        gameRoom.ball.y > gameRoom.playerOne.paddle.y - gameRoom.ball.radius &&
        gameRoom.ball.y <
          gameRoom.playerOne.paddle.y +
            gameRoom.playerOne.paddle.height +
            gameRoom.ball.radius
      ) {
        // console.log("left paddle hit");
        gameRoom.ball.moveX = -gameRoom.ball.moveX;
      } else {
        // console.log("left side hit");
        gameRoom.winner = 2;
        return await this.checkScore(gameRoom);
      }
    }
    /* 
        if height + proposed ball move will hit the top OR
        if height + proposed ball move will hit bottom
        - reverse direction of ball
    */
    if (
      gameRoom.ball.y + gameRoom.ball.moveY + gameRoom.ball.radius <
        gameRoom.view.offset + gameRoom.view.borderLines ||
      gameRoom.ball.y + gameRoom.ball.moveY >
        gameRoom.view.height - gameRoom.view.offset - gameRoom.view.borderLines
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
        gameRoom.ball.moveX / gameRoom.view.width,
        gameRoom.ball.moveY / gameRoom.view.height,
      );
  }
}
