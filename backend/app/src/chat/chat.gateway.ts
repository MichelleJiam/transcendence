import { forwardRef, Inject } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";

import { Socket, Server } from "socket.io";
import { CreateMessageDto } from "src/message/dto/create-message.dto";
import { InviteToGameDto } from "src/chat/dto/invite-to-game.dto";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
  },
  namespace: "chat",
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<void> {
    try {
      const message = await this.chatService.postMessageToChatroom(payload);
      this.server.emit("recMessage", message);
    } catch (err) {
      console.error(err);
    }
  }

  @SubscribeMessage("inviteToGame")
  async inviteToGame(client: Socket, payload: InviteToGameDto) {
    console.log(payload);
    if (payload.status == "waiting") {
      await this.chatService.createGameInvite(payload);
      this.server.emit("sendGameRequestToPlayerTwo", payload);
    } else if (payload.status == "accept") {
      await this.chatService.deleteGameInvite(payload);
      this.server.emit("acceptedGameInvite", payload);
    } else if (payload.status == "reject") {
      await this.chatService.deleteGameInvite(payload);
      this.server.emit("declinedGameInvite", payload);
    } else if (payload.status == "cancel") {
      await this.chatService.deleteGameInvite(payload);
      this.server.emit("canceledInvite", payload);
    } else {
      await this.chatService.deleteGameInvite(payload);
      this.server.emit("inviteGameError", payload);
      console.error("Game invite failed");
    }
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
  }
}
