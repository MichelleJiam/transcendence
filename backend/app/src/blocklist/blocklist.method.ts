import { Message } from "src/message/message.entity";
import { Blocklist } from "./blocklist.entity";

export function occursInBlocklist(
  blocklist: Blocklist[],
  userId: number,
): boolean {
  for (const i of blocklist) {
    if (i.id === userId) return true;
  }
  return false;
}

export function filterMessages(
  messages: Message[],
  blocklist: Blocklist[],
): Message[] {
  for (const i of blocklist) {
    messages = messages.filter((message: Message) => {
      return message.userId.id !== i.blockedUser.id;
    });
  }
  return messages;
}
