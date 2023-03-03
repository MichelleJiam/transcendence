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
import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: {
    origin: "*",
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

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
