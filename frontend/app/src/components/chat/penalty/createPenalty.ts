import apiRequest from "@/utils/apiRequest";

export class UpdateChatroomDto {
  type?: string;
  chatroomName?: string;
  password?: string;
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

  apiRequest(url, "post", { data: newPenalty }).catch((error) => {
    console.log(error);
  });
} // this should work for both mute and ban

class Blocklist {
  blocklistOwner!: number;
  blockedUser!: number;
}

export function createBlock(blocklistOwner: number, blockedUser: number) {
  const url = "/blocklist/create";

  const newBlocklist = new Blocklist();
  newBlocklist.blocklistOwner = blocklistOwner;
  newBlocklist.blockedUser = blockedUser;

  apiRequest(url, "post", { data: newBlocklist }).catch((error) => {
    console.log(error);
  });
}

class AddAdminDto {
  newAdmin!: number;
  byAdmin!: number;
}

export function makeAdmin(
  chatroomId: number,
  newAdmin: number,
  byAdmin: number
) {
  const url = "/chat/" + chatroomId + "/add/admin";

  const admin = new AddAdminDto();
  admin.byAdmin = byAdmin;
  admin.newAdmin = newAdmin;

  apiRequest(url, "put", { data: admin }).catch((error) => {
    console.log(error);
  });
}

export function deleteAdmin(
  chatroomId: number,
  adminId: number,
  toDeleteId: number
) {
  const url =
    "/chat/" + chatroomId + "/admin/" + adminId + "/delete/" + toDeleteId;

  apiRequest(url, "delete").catch((error) => {
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

  apiRequest(url, "put", { data: owner }).catch((error) => {
    console.log(error);
  });
}
