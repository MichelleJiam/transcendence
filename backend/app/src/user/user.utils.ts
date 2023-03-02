import { HttpException, HttpStatus } from "@nestjs/common";

export function isCurrentUser(currentUserId: number, sentUserId: number) {
  if (currentUserId !== sentUserId)
    throw new HttpException(
      "sent UserID does not match current userID",
      HttpStatus.BAD_REQUEST,
    );
}
