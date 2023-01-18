import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Game } from "./entities/game.entity";
import { GameService } from "./game.service";
import { Server, Socket } from "socket.io";
import { Ball } from "./pong.types";
import { Get, Param } from "@nestjs/common";

// by default will listen to same port http is listening on
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  // namespace: "pong", FIGURE OUT HOW THIS WORKS
})
export class GameGateway {
  @WebSocketServer() /* tell NestJS to inject the WebSocket server */
  server!: Server; /* reference to socket.io server under the hood */
  constructor(private readonly gameService: GameService) {}

  position = {
    x: 0,
    y: 0,
  };

  ballPos: Ball = {};

  handleConnection(client: Socket) {
    console.log(client.id + " connected");
    client.on("join", function (room: string) {
      client.join(room);
      console.log(client.id, " joined room: ", room);
    });
    this.server.emit("position", this.position);
  }

  handleDisconnect(client: Socket) {
    console.log(client.id + " disconnected");
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const game = await this.gameService.findOneGame(id);
    console.log(game);
    return game;
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

  @SubscribeMessage("move")
  async move(@MessageBody() direction: string) {
    switch (direction) {
      case "left":
        this.position.x -= 5;
        this.server.emit("position", this.position);
        break;
      case "right":
        this.position.x += 5;
        this.server.emit("position", this.position);
        break;
      case "up":
        this.position.y -= 5;
        this.server.emit("position", this.position);
        break;
      case "down":
        this.position.y += 5;
        this.server.emit("position", this.position);
        break;
    }
  }
}
