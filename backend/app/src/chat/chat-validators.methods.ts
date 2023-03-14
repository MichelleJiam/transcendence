import { HttpException, HttpStatus } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { Chatroom } from "./chat.entity";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { UpdateChatroomDto } from "./dto/update-chat.dto";

export function validateChatroomType(type: string): boolean {
  if (
    type !== "public" &&
    type !== "password" &&
    type !== "private" &&
    type !== "DM"
  ) {
    throw new HttpException("Invalid chatroom type", HttpStatus.BAD_REQUEST);
  }
  return true;
}

export function validateChatroomName(chatroomName: string): boolean {
  if (!chatroomName || !(chatroomName && chatroomName.trim())) {
    throw new HttpException(
      "Chatroom name cannot be empty",
      HttpStatus.BAD_REQUEST,
    );
  }
  return true;
}

export function validateChatroomPasswordSet(password: string): boolean {
  if (!(password && password.trim())) {
    throw new HttpException(
      "Password type chatroom cannot have no password",
      HttpStatus.BAD_REQUEST,
    );
  }
  return true;
}

export function validateChatroomDto(
  createChatroomDto: CreateChatroomDto,
): boolean {
  validateChatroomType(createChatroomDto.type);
  validateChatroomName(createChatroomDto.chatroomName);
  if (createChatroomDto.type === "password") {
    validateChatroomPasswordSet(createChatroomDto.password);
  }
  return true;
}

export function createChatroomEntity(
  createChatroomDto: CreateChatroomDto,
  user: User,
  userTwo?: User | undefined,
): Chatroom {
  validateChatroomDto(createChatroomDto); // extra check for validation in case something changed between validation function call and the create chatroom call
  const chatroom = new Chatroom();
  chatroom.chatroomName = createChatroomDto.chatroomName;
  chatroom.type = createChatroomDto.type;
  if (chatroom.type === "password")
    chatroom.password = createChatroomDto.password;
  chatroom.owner = user;
  chatroom.member = [user];
  chatroom.admin = [user];
  if (chatroom.type === "DM" && userTwo !== undefined) {
    chatroom.member.push(userTwo);
    chatroom.admin.push(userTwo);
  }
  return chatroom;
}

export function deleteAdmin(chatroom: Chatroom, toDeleteId: number): Chatroom {
  chatroom.admin = chatroom.admin.filter((user: User) => {
    return user.id !== toDeleteId;
  });
  return chatroom;
}

export function deleteFromChatroom(
  chatroom: Chatroom,
  userId: number,
): Chatroom {
  chatroom.member = chatroom.member.filter((user: User) => {
    return user.id !== userId;
  });
  chatroom.admin = chatroom.admin.filter((user: User) => {
    return user.id !== userId;
  });
  return chatroom;
}

export function swapOwner(chatroom: Chatroom, newOwner: User): Chatroom {
  chatroom.owner = newOwner;
  return chatroom;
}

export function addAdmin(chatroom: Chatroom, newAdmin: User): Chatroom {
  chatroom.admin.push(newAdmin);
  return chatroom;
}

export function addMember(chatroom: Chatroom, newMember: User): Chatroom {
  chatroom.member.push(newMember);
  return chatroom;
}

export function createUpdatedChatroomEntity(
  chatroom: Chatroom,
  updateChatroomDto: UpdateChatroomDto,
): Chatroom {
  if (updateChatroomDto.type !== undefined) {
    chatroom.type = updateChatroomDto.type;
    if (updateChatroomDto.type === "password") {
      if (updateChatroomDto.password === undefined) {
        throw new HttpException(
          "password type chat must have a password",
          HttpStatus.BAD_REQUEST,
        );
      } else {
        chatroom.password = updateChatroomDto.password;
      }
    }
  }
  if (
    updateChatroomDto.chatroomName !== undefined &&
    validateChatroomName(updateChatroomDto.chatroomName)
  ) {
    chatroom.chatroomName = updateChatroomDto.chatroomName;
  }
  return chatroom;
}
