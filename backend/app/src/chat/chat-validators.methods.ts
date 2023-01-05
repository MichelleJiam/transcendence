import { HttpException, HttpStatus } from "@nestjs/common";
import { CreateChatroomDto } from "./dto/create-chat.dto";

export function validateChatroomType(type: string): void {
  if (type != "public" && type != "password" && type != "private") {
    console.log("From Backend: Invalid chatroom type");
    throw new HttpException("Invalid chatroom type", HttpStatus.BAD_REQUEST);
  }
}

export function validateChatroomName(chatroomName: string): void {
  if (!chatroomName || !(chatroomName && chatroomName.trim())) {
    console.log("From Backend: Chatroom name cannot be empty");
    throw new HttpException(
      "Chatroom name cannot be empty",
      HttpStatus.BAD_REQUEST,
    );
  }
}

export function validateChatroomPasswordSet(password: string) {
  if (!(password && password.trim())) {
    console.log("From Backend: Password type chatroom cannot have no password");
    throw new HttpException(
      "Password type chatroom cannot have no password",
      HttpStatus.BAD_REQUEST,
    );
  }
}

export function validateChatroomDto(
  createChatroomDto: CreateChatroomDto,
): boolean {
  validateChatroomType(createChatroomDto.type);
  validateChatroomName(createChatroomDto.chatroomName);
  if (createChatroomDto.type == "password") {
    validateChatroomPasswordSet(createChatroomDto.password);
  }
  return true;
}

export function hasMultipleAdmins(chatroomUserAdminAmount: number) {
  if (chatroomUserAdminAmount < 2) {
    console.log(
      "You are the only admin! Please assign admin to another user or delete the chat.",
    );
    throw new HttpException(
      "You are the only admin! Please assign admin to another user or delete the chat.",
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
