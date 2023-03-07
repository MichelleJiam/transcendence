import apiRequest, { baseUrl } from "@/utils/apiRequest";
import { io } from "socket.io-client";
import { ref } from "vue";

const socketUrl = baseUrl + "/penalty";
const socket = io(socketUrl);

export class UpdateChatroomDto {
  password!: string;
}

export class AddMemberDto {
  member!: number;
  password?: string;
}

export class CreateDMDto {
  type = "DM";
  chatroomName!: string;
  user!: number;
  otherUser!: number;
}

export class SendMessageDto {
  chatroomId!: number;
  body!: string;
  userId!: number;
}

export class PostChatDto {
  type!: string;
  chatroomName!: string;
  password?: string;
  user!: number;
  otherUser?: number;
}

class Penalty {
  penaltyType!: string;
  user!: number;
  chatroom!: number;
}

export async function createPenalty(
  adminId: number,
  userId: number,
  penaltyType: string,
  chatroomId: number
) {
  const url = "/chat/" + chatroomId + "/admin/" + adminId + "/penalty";

  const newPenalty = new Penalty();
  newPenalty.chatroom = chatroomId;
  newPenalty.user = userId;
  newPenalty.penaltyType = penaltyType;

  await apiRequest(url, "post", { data: newPenalty })
    .then((response) => {
      if (response.data) socket.emit("checkBan", newPenalty);
    })
    .catch((error) => {
      console.error(error);
    });
}

export class Blocklist {
  id?: number;
  blocklistOwner!: number;
  blockedUser!: number;
}

class AddAdminDto {
  newAdmin!: number;
  byAdmin!: number;
}

export async function makeAdmin(
  chatroomId: number,
  byAdmin: number,
  newAdmin: number
) {
  const url = "/chat/" + chatroomId + "/add/admin";

  const admin = new AddAdminDto();
  admin.byAdmin = byAdmin;
  admin.newAdmin = newAdmin;

  await apiRequest(url, "put", { data: admin })
    .then((response) => {
      socket.emit("newUserState");
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function deleteAdmin(
  chatroomId: number,
  adminId: number,
  toDeleteId: number
) {
  const url =
    "/chat/" + chatroomId + "/admin/" + adminId + "/delete/admin/" + toDeleteId;

  await apiRequest(url, "delete")
    .then((response) => {
      socket.emit("newUserState");
    })
    .catch((error) => {
      console.error(error);
    });
}

class SwapOwnerDto {
  oldOwner!: number;
  newOwner!: number;
}

export async function swapOwner(
  chatroomId: number,
  oldOwner: number,
  newOwner: number
) {
  const url = "/chat/" + chatroomId + "/change_owner";

  const owner = new SwapOwnerDto();
  owner.oldOwner = oldOwner;
  owner.newOwner = newOwner;

  await apiRequest(url, "put", { data: owner })
    .then((response) => {
      socket.emit("newUserState");
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function isAdmin(
  chatroomId: number,
  userId: number
): Promise<boolean> {
  const url = "/chat/" + chatroomId + "/is_admin/" + userId;
  const isUserAdmin = ref<boolean>();

  await apiRequest(url, "get").then((response) => {
    isUserAdmin.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  if (isUserAdmin.value == true) return true;
  return false;
}

export async function isMember(
  chatroomId: number,
  userId: number
): Promise<boolean> {
  const url = "/chat/" + chatroomId + "/is_member/" + userId;

  const isUserMember = ref<boolean>();

  await apiRequest(url, "get").then((response) => {
    isUserMember.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  if (isUserMember.value == true) return true;
  return false;
}

export async function isOwner(
  chatroomId: number,
  userId: number
): Promise<boolean> {
  const url = "/chat/" + chatroomId + "/is_owner/" + userId;

  const isUserOwner = ref<boolean>();

  await apiRequest(url, "get").then((response) => {
    isUserOwner.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  if (isUserOwner.value == true) return true;
  return false;
}

export class KickedAUserDto {
  chatroomId!: number;
  userId!: number;
}

export async function kickUser(
  chatroomId: number,
  adminId: number,
  toDeleteId: number
) {
  const url =
    "/chat/" + chatroomId + "/admin/" + adminId + "/delete/user/" + toDeleteId;

  await apiRequest(url, "delete")
    .then((response) => {
      const kickedAUserDto = new KickedAUserDto();
      kickedAUserDto.chatroomId = chatroomId;
      kickedAUserDto.userId = toDeleteId;
      socket.emit("kickUser", kickedAUserDto);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function buildUserPageUrlString(userId: number): Promise<string> {
  const url = "/user/" + userId;
  const userData = ref();

  await apiRequest(url, "get")
    .then((response) => {
      userData.value = response.data;
      console.log("/player/" + userData.value.playerName);
      return "/player/" + userData.value.playerName;
    })
    .catch((err) => console.error(err));
  return "/player/unknown";
}

export async function UserPageUrlString(userId: number): Promise<string> {
  const string = await buildUserPageUrlString(userId);
  return String(string);
}

export async function buildUserPageUrl(userId: number) {
  const url = "/user/" + userId;
  const userData = ref();

  await apiRequest(url, "get")
    .then((response) => {
      userData.value = response.data;
      console.log("/player/" + userData.value.playerName);
      location.href = "/player/" + userData.value.playerName;
    })
    .catch((err) => console.error(err));
}
