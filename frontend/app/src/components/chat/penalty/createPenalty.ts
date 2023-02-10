import apiRequest from "@/utils/apiRequest";

class Penalty {
  penaltyType!: string;
  user!: number;
  chatroom!: number;
}

class Blocklist {
  blocklistOwner!: number;
  blockedUser!: number;
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

export function createBlock(blocklistOwner: number, blockedUser: number) {
  const url = "/blocklist/create";

  const newBlocklist = new Blocklist();
  newBlocklist.blocklistOwner = blocklistOwner;
  newBlocklist.blockedUser = blockedUser;

  apiRequest(url, "post", { data: newBlocklist }).catch((error) => {
    console.log(error);
  });
}
