import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { number, string } from "joi";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { Ball, GameRoom } from "./pong.types";

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
  async movePaddleUp(
    @MessageBody() gameRoom: GameRoom
  ) 
  {
    if (gameRoom.player == "1") {
      gameRoom.paddleOne.y = Math.max(
        gameRoom.paddleOne.y - gameRoom.view.height * 0.01,
        gameRoom.view.offset + gameRoom.view.borderLines
       );
    } else {
      gameRoom.paddleTwo.y = Math.max(
        gameRoom.paddleTwo.y - gameRoom.view.height * 0.01,
        gameRoom.view.offset + gameRoom.view.borderLines
            );
    }
    this.server.to(gameRoom.room).emit("movePaddleUp", gameRoom);
  }

  @SubscribeMessage("movePaddleDown")
  async movePaddleDown(
    @MessageBody() gameRoom: GameRoom,
  ) {
    if (gameRoom.player == "1") {
      gameRoom.paddleOne.y = Math.min(
        gameRoom.paddleOne.y + gameRoom.view.height * 0.01,
        gameRoom.view.height - gameRoom.paddleOne.height - gameRoom.view.offset - gameRoom.view.borderLines
      );
    } else {
      gameRoom.paddleTwo.y = Math.min(
        gameRoom.paddleTwo.y + gameRoom.view.height * 0.01,
        gameRoom.view.height - gameRoom.paddleTwo.height - gameRoom.view.offset - gameRoom.view.borderLines
      );
    }
      this.server.to(gameRoom.room).emit("movePaddleDown", gameRoom);
  }

  @SubscribeMessage("moveBall")
  async moveBall(
    @MessageBody() gameRoom: GameRoom,
  ) {
  if (
    gameRoom.ball.x + gameRoom.ball.moveX >
    gameRoom.view.width - gameRoom.ball.radius - gameRoom.paddleTwo.width * 2 - gameRoom.paddleTwo.offset
  ) {
    if (
      gameRoom.ball.y > gameRoom.paddleTwo.y - gameRoom.ball.radius &&
      gameRoom.ball.y < gameRoom.paddleTwo.y + gameRoom.paddleTwo.height + gameRoom.ball.radius
    ) {
      console.log("RIGHT PADDLE HIT");
      gameRoom.ball.moveX = -gameRoom.ball.moveX;
    } else {
      console.log("RIGHT PADDLE MISSED - END GAME");
      gameRoom.ball.moveX = -gameRoom.ball.moveX;
      // endGame(player1); // figure out how to handle this (likely emit it)
    }
  } else if (
    gameRoom.ball.x + gameRoom.ball.moveX <
    gameRoom.ball.radius + gameRoom.paddleTwo.width + gameRoom.paddleTwo.offset
    ) {
      if (
        gameRoom.ball.y > gameRoom.paddleOne.y - gameRoom.ball.radius &&
        gameRoom.ball.y < gameRoom.paddleOne.y + gameRoom.paddleOne.height + gameRoom.ball.radius
      ) {
        gameRoom.ball.moveX = -gameRoom.ball.moveX;
        console.log("LEFT PADDLE HIT");
      } else {
        gameRoom.ball.moveX = -gameRoom.ball.moveX;
        // endGame(player2); // figure out how to handle this (likely emit it)
      }
    }
    if (gameRoom.ball.y + gameRoom.ball.moveY < gameRoom.ball.radius + gameRoom.view.offset - gameRoom.view.borderLines) {
      gameRoom.ball.moveY = -gameRoom.ball.moveY;
      console.log("TOP WALL HIT");
    } else if (gameRoom.ball.y + gameRoom.ball.moveY > gameRoom.view.height - gameRoom.ball.radius - gameRoom.view.offset) {
      gameRoom.ball.moveY = -gameRoom.ball.moveY;
      console.log("BOTTOM WALL HIT");
    }
  gameRoom.ball.x += gameRoom.ball.moveX;
  gameRoom.ball.y += gameRoom.ball.moveY;
  this.server.to(gameRoom.room).emit("moveBall", gameRoom);
}
}
