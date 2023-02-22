import apiRequest from "@/utils/apiRequest";
import { ref } from "vue";

export class UpdateChatroomDto {
  type?: string;
  chatroomName?: string;
  password?: string;
}

export class AddMemberDto {
  member!: number;
  password?: string;
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

export function createPenalty(
  adminId: number,
  userId: number,
  penaltyType: string,
  chatroomId: number
) {
  const url = "/chat/" + chatroomId + "/admin/" + adminId + "/penalty";
  console.log(url);

  const newPenalty = new Penalty();
  newPenalty.chatroom = chatroomId;
  newPenalty.user = userId;
  newPenalty.penaltyType = penaltyType;

  apiRequest(url, "post", { data: newPenalty })
    .then((response) => {
      location.reload();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

class Blocklist {
  blocklistOwner!: number;
  blockedUser!: number;
}

export function createBlock(blocklistOwner: number, blockedUser: number) {
  const url = "/blocklist/create";

  const newBlocklist = new Blocklist();
  newBlocklist.blocklistOwner = blocklistOwner;
  newBlocklist.blockedUser = blockedUser;

  apiRequest(url, "post", { data: newBlocklist })
    .then((response) => {
      location.reload();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function unBlock(blocklistOwner: number, blockedUser: number) {
  const url =
    "/blocklist/remove/owner/" + blocklistOwner + "/blocked/" + blockedUser;

  apiRequest(url, "delete").then((response) => {
    location.reload();
    console.log(response);
  });
}

class AddAdminDto {
  newAdmin!: number;
  byAdmin!: number;
}

export function makeAdmin(
  chatroomId: number,
  byAdmin: number,
  newAdmin: number
) {
  const url = "/chat/" + chatroomId + "/add/admin";

  const admin = new AddAdminDto();
  admin.byAdmin = byAdmin;
  admin.newAdmin = newAdmin;

  apiRequest(url, "put", { data: admin })
    .then((response) => {
      location.reload();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function deleteAdmin(
  chatroomId: number,
  adminId: number,
  toDeleteId: number
) {
  const url =
    "/chat/" + chatroomId + "/admin/" + adminId + "/delete/admin/" + toDeleteId;

  apiRequest(url, "delete")
    .then((response) => {
      location.reload();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

class SwapOwnerDto {
  oldOwner!: number;
  newOwner!: number;
}

export function swapOwner(
  chatroomId: number,
  oldOwner: number,
  newOwner: number
) {
  const url = "/chat/" + chatroomId + "/change_owner";

  const owner = new SwapOwnerDto();
  owner.oldOwner = oldOwner;
  owner.newOwner = newOwner;

  apiRequest(url, "put", { data: owner })
    .then((response) => {
      location.reload();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
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

export async function kickUser(
  chatroomId: number,
  adminId: number,
  toDeleteId: number
) {
  const url =
    "/chat/" + chatroomId + "/admin/" + adminId + "/delete/user/" + toDeleteId;
  await apiRequest(url, "delete")
    .then((response) => {
      location.reload();
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
