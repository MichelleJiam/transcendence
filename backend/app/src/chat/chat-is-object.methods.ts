import { Chatroom } from "./chat.entity";

export function isOwner(chatroom: Chatroom, userId: number): boolean {
  if (chatroom.owner.id === userId) {
    return true;
  } else {
    return false;
  }
}

export function isAdmin(chatroom: Chatroom, userId: number): boolean {
  for (let i = 0; i < chatroom.admin.length; i++) {
    if (chatroom.admin[i].id == userId) return true;
  }
  return false;
}

export function isMember(chatroom: Chatroom, userId: number): boolean {
  for (let i = 0; i < chatroom.member.length; i++) {
    if (chatroom.member[i].id == userId) return true;
  }
  return false;
}

export function isBanned(chatroom: Chatroom, userId: number): boolean {
  if (chatroom.ban.length < 0) return false;
  for (let i = 0; i < chatroom.admin.length; i++) {
    if (chatroom.ban[i].userId.id == userId) return true;
  }
  return false;
}

export function isMuted(chatroom: Chatroom, userId: number): boolean {
  if (chatroom.mute.length < 0) return false;
  for (let i = 0; i < chatroom.admin.length; i++) {
    if (chatroom.mute[i].userId.id == userId) return true;
  }
  return false;
}
