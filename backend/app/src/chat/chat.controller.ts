import { Controller, Post, Get, Body } from "@nestjs/common";
import { ChatService } from "./Chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
}
