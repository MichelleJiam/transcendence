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
import { GameRoom, GameWithPlayer, PlayerInput } from "./pong.types";

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
  gameroomMap = new Map<number, GameRoom>();
  intervalIdMap = new Map<number, ReturnType<typeof setInterval>>();
  countdownMap = new Map<number, ReturnType<typeof setInterval>>();
  socketMap = new Map<string, GameRoom>();

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
      const leftGameRoom = this.socketMap.get(client.id);
      if (leftGameRoom) {
        this.gameService.setDisconnectedPlayer(
          leftGameRoom,
          leftGame.playerNum,
        );
        this.forfeitGame(leftGameRoom);
      }
      // updates active game list on lobby user
      this.updateActiveGames();

      // this.server
      //   // .to(String(leftGame.game.id))
      //   .emit("playerForfeited", leftGame.playerNum);
      // this.cleanUpOnPlayerDisconnect(leftGame);
    } else {
      console.log("No active games being played were left");
      this.checkMatchQueueOnDisconnect(client.id);
      // this.server.emit("disconnection");
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
    client.join(String(gameRoom.id));
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
    client.join(String(gameRoom.id));
    this.socketMap.set(client.id, gameRoom);
    if (gameRoom.player === 2 && gameRoom.state === this.STATE.READY) {
      this.server.emit("addPlayerOne", gameRoom);
    } else if (gameRoom.player === 1) {
      this.updateActiveGames();
      this.server.to(String(gameRoom.id)).emit("savePlayerSockets", gameRoom);
    }
  }

  @SubscribeMessage("createNewGame")
  createNewGame(@MessageBody() gameRoom: GameRoom) {
    this.gameroomMap.set(gameRoom.id, gameRoom);
    this.startGame(gameRoom.id);
  }

  startGame(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    if (updatedGameRoom) {
      updatedGameRoom.countdown = 3;
    }
    this.gameroomMap.set(gameRoomId, { ...updatedGameRoom });

    /* countdown and game loop */
    this.countdownMap.set(
      updatedGameRoom.id,
      setInterval(() => {
        this.server
          .to(String(updatedGameRoom.id))
          .emit("drawCountdown", updatedGameRoom.countdown);
        if (updatedGameRoom.countdown === -1) {
          clearInterval(this.countdownMap.get(updatedGameRoom.id));
          this.countdownMap.delete(updatedGameRoom.id);
          this.intervalIdMap.set(
            updatedGameRoom.id,
            setInterval(() => {
              this.startGameLoop(updatedGameRoom);
            }, 8),
          );
        }
        updatedGameRoom.countdown--;
      }, 750),
    );
  }

  startGameLoop(gameRoom: GameRoom) {
    this.updateBall(gameRoom.id);
    this.server.to(String(gameRoom.id)).emit("updateGameRoom", gameRoom);
  }

  /************
   * MOVEMENT *
   ************/

  handlePlayerOneInput(input: PlayerInput) {
    const move = 0.05;
    const updatedGameRoom = this.gameroomMap.get(input.id) as GameRoom;
    if (input.direction === "up") {
      updatedGameRoom.playerOne.paddle.y = Math.max(
        updatedGameRoom.playerOne.paddle.y - updatedGameRoom.view.height * move,
        updatedGameRoom.view.offset + updatedGameRoom.view.borderLines,
      );
    } else {
      updatedGameRoom.playerOne.paddle.y = Math.min(
        updatedGameRoom.playerOne.paddle.y + updatedGameRoom.view.height * move,
        updatedGameRoom.view.height -
          updatedGameRoom.playerOne.paddle.height -
          updatedGameRoom.view.offset -
          updatedGameRoom.view.borderLines,
      );
    }
    return updatedGameRoom;
  }

  handlePlayerTwoInput(input: PlayerInput) {
    const move = 0.05;
    const updatedGameRoom = this.gameroomMap.get(input.id) as GameRoom;

    if (input.direction === "up") {
      updatedGameRoom.playerTwo.paddle.y = Math.max(
        updatedGameRoom.playerTwo.paddle.y - updatedGameRoom.view.height * move,
        updatedGameRoom.view.offset + updatedGameRoom.view.borderLines,
      );
    } else {
      updatedGameRoom.playerTwo.paddle.y = Math.min(
        updatedGameRoom.playerTwo.paddle.y + updatedGameRoom.view.height * move,
        updatedGameRoom.view.height -
          updatedGameRoom.playerTwo.paddle.height -
          updatedGameRoom.view.offset -
          updatedGameRoom.view.borderLines,
      );
    }
    return updatedGameRoom;
  }

  @SubscribeMessage("playerInput")
  playerInput(@MessageBody() input: PlayerInput) {
    let updatedGameRoom = this.gameroomMap.get(input.id) as GameRoom;
    if (updatedGameRoom) {
      if (input.player === 1) {
        updatedGameRoom = this.handlePlayerOneInput(input);
      }
      if (input.player === 2) {
        updatedGameRoom = this.handlePlayerTwoInput(input);
      }
      this.gameroomMap.set(input.id, { ...updatedGameRoom });
    }
  }

  ballHitRightSide(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    if (
      updatedGameRoom.ball.x + updatedGameRoom.ball.moveX >
      updatedGameRoom.view.width -
        updatedGameRoom.playerTwo.paddle.width -
        updatedGameRoom.playerTwo.paddle.offset -
        updatedGameRoom.ball.radius * 2
    )
      return true;
    else return false;
  }

  ballHitRightPaddle(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    if (
      updatedGameRoom.ball.y >
        updatedGameRoom.playerTwo.paddle.y - updatedGameRoom.ball.radius &&
      updatedGameRoom.ball.y <
        updatedGameRoom.playerTwo.paddle.y +
          updatedGameRoom.playerTwo.paddle.height +
          updatedGameRoom.ball.radius
    )
      return true;
    else return false;
  }

  ballHitLeftSide(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    if (
      updatedGameRoom.ball.x + updatedGameRoom.ball.moveX <
      updatedGameRoom.ball.radius +
        updatedGameRoom.playerTwo.paddle.width +
        updatedGameRoom.playerTwo.paddle.offset
    )
      return true;
    else return false;
  }

  ballHitLeftPaddle(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    if (
      updatedGameRoom.ball.y >
        updatedGameRoom.playerOne.paddle.y - updatedGameRoom.ball.radius &&
      updatedGameRoom.ball.y <
        updatedGameRoom.playerOne.paddle.y +
          updatedGameRoom.playerOne.paddle.height +
          updatedGameRoom.ball.radius
    )
      return true;
    return false;
  }

  ballHitTopWall(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    if (
      updatedGameRoom.ball.y +
        updatedGameRoom.ball.moveY +
        updatedGameRoom.ball.radius <
      updatedGameRoom.view.offset + updatedGameRoom.view.borderLines
    )
      return true;
    else return false;
  }

  ballHitBottomWall(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    if (
      updatedGameRoom.ball.y + updatedGameRoom.ball.moveY >
      updatedGameRoom.view.height -
        updatedGameRoom.view.offset -
        updatedGameRoom.view.borderLines
    )
      return true;
    else return false;
  }

  async updateBall(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;

    if (this.ballHitRightSide(gameRoomId)) {
      if (this.ballHitRightPaddle(gameRoomId)) {
        updatedGameRoom.ball.moveX = -updatedGameRoom.ball.moveX;
      } else {
        updatedGameRoom.winner = 1;
        this.gameroomMap.set(gameRoomId, { ...updatedGameRoom });
        return await this.checkScore(gameRoomId);
      }
    } else if (this.ballHitLeftSide(gameRoomId)) {
      if (this.ballHitLeftPaddle(gameRoomId)) {
        updatedGameRoom.ball.moveX = -updatedGameRoom.ball.moveX;
      } else {
        updatedGameRoom.winner = 2;
        this.gameroomMap.set(gameRoomId, { ...updatedGameRoom });
        return await this.checkScore(gameRoomId);
      }
    }
    if (this.ballHitTopWall(gameRoomId) || this.ballHitBottomWall(gameRoomId)) {
      updatedGameRoom.ball.moveY = -updatedGameRoom.ball.moveY;
    }
    updatedGameRoom.ball.x += updatedGameRoom.ball.moveX;
    updatedGameRoom.ball.y += updatedGameRoom.ball.moveY;
    this.gameroomMap.set(gameRoomId, { ...updatedGameRoom });
  }

  /************
   * MATCH END *
   ************/

  resetBall(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    if (updatedGameRoom.ball.moveX < 0) {
      updatedGameRoom.ball.x =
        updatedGameRoom.view.width - updatedGameRoom.view.width / 4;
    } else {
      updatedGameRoom.ball.x = updatedGameRoom.view.width / 4;
    }
    updatedGameRoom.ball.moveY = -((updatedGameRoom.view.width * 0.014) / 5);
    this.gameroomMap.set(gameRoomId, { ...updatedGameRoom });
    this.server.to(String(gameRoomId)).emit("updateGameRoom", updatedGameRoom);
    this.startGame(updatedGameRoom.id);
  }

  async checkScore(gameRoomId: number) {
    clearInterval(this.intervalIdMap.get(gameRoomId));
    this.server.to(String(gameRoomId)).emit("stopGameLoop");
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;

    if (updatedGameRoom.winner == 1) updatedGameRoom.playerOne.score++;
    else updatedGameRoom.playerTwo.score++;
    this.gameroomMap.set(gameRoomId, { ...updatedGameRoom });
    this.server.to(String(gameRoomId)).emit("updateGameRoom", updatedGameRoom);
    if (
      updatedGameRoom.playerOne.score === 3 ||
      updatedGameRoom.playerTwo.score === 3
    ) {
      await this.endGame(gameRoomId);
    } else {
      this.resetBall(gameRoomId);
    }
  }

  /************
   * GAME END *
   ************/

  async endGame(gameRoomId: number) {
    const updatedGameRoom = this.gameroomMap.get(
      Number(gameRoomId),
    ) as GameRoom;
    let winnerName;

    updatedGameRoom.playerOne.score > updatedGameRoom.playerTwo.score
      ? (winnerName = updatedGameRoom.playerOne.name)
      : (winnerName = updatedGameRoom.playerTwo.name);

    this.server.to(String(gameRoomId)).emit("endGame", winnerName);

    this.socketMap.delete(updatedGameRoom.playerOne.socket);
    this.socketMap.delete(updatedGameRoom.playerTwo.socket);
    this.gameroomMap.delete(gameRoomId);
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
  async forfeitGame(@MessageBody() gameRoom: GameRoom) {
    console.log("Forfeiting game as player ", gameRoom.player);
    let updatedGameRoom = this.gameroomMap.get(Number(gameRoom.id)) as GameRoom;
    updatedGameRoom.playerOne.disconnected = gameRoom.playerOne.disconnected;
    updatedGameRoom.playerTwo.disconnected = gameRoom.playerTwo.disconnected;

    clearInterval(this.intervalIdMap.get(gameRoom.id));
    clearInterval(this.countdownMap.get(gameRoom.id));
    this.intervalIdMap.delete(gameRoom.id);
    this.countdownMap.delete(gameRoom.id);

    if (this.gameService.bothPlayersDisconnected(gameRoom)) {
      console.log("Both players disconnected");
      this.gameService.remove(Number(gameRoom.id));
    } else {
      updatedGameRoom = this.gameService.setForfeitScoreWinner(updatedGameRoom);
      this.gameroomMap.set(gameRoom.id, { ...updatedGameRoom });
      this.server
        .to(String(gameRoom.id))
        .emit("updateGameRoom", updatedGameRoom);
      this.endGame(gameRoom.id);
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
      const disconnectedPlayer = gameRoom.player;
      this.gameService.setDisconnectedPlayer(gameRoom, disconnectedPlayer);
      this.forfeitGame(gameRoom);
      // this.server.to(gameRoom.id).emit("playerForfeited", disconnectedPlayer);
    }
    // this.leaveRoom(client, gameRoom.id);
  }

  // async cleanUpOnPlayerDisconnect(leftGame: GameWithPlayer) {
  //   console.log("Cleaning up on player disconnect");
  //   // updates active game list on disconnecting player side
  //   if (leftGame.game) {
  //     this.gameService.setGameToDone(leftGame.game.id);
  //   }

  //   // updates active game list on lobby user
  //   await this.updateActiveGames();

  //   // reset disconnected user status back to online
  //   if (leftGame.playerId) {
  //     await this.userService.updateUserStatus(leftGame.playerId, {
  //       status: 0,
  //     });
  //   }
  // }

  // remove disconnected user if they were in match queue
  async checkMatchQueueOnDisconnect(socketId: string) {
    console.log("Checking if player socket ", socketId, " was in queue");
    const leftMatch = await this.matchService.findPlayerInMatchQueueBySocket(
      socketId,
    );
    if (leftMatch) {
      await this.matchService.remove(leftMatch.playerId);
    }
  }
}
