import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { Message } from "./message.entity";

export function createNewMessage(
  body: string,
  chatroom: Chatroom,
  user: User,
): Message {
  const newMessage = new Message();
  newMessage.body = body;
  newMessage.chatroomId = chatroom;
  newMessage.userId = user;

  return newMessage;
}

export function validateBody(body: string): boolean {
  if (body == null || body.match(/^\s*$/) !== null) return false;
  return true;
}
