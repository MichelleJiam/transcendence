import type { User } from "@/stores/FriendStore";
import apiRequest from "@/utils/apiRequest";
import type { Store } from "pinia";

export async function sendUtilsFriendRequest(
  userId: number,
  player: User,
  store: Store<
    "friend",
    { users: User[]; isLoading: boolean },
    {},
    {
      updateUserList(userId: number): Promise<void>;
      removeRelation(player: User): Promise<void>;
      acceptRequest(player: User): Promise<void>;
    }
  >
) {
  if (userId) {
    try {
      await apiRequest("/friend/request", "post", {
        data: {
          source: userId,
          target: player.id,
          status: "PENDING",
        },
      });
    } catch (error) {
      console.log(error);
      return;
    }
    await store.updateUserList(userId);
  } else console.log("No user id provided in url");
}

export async function utilsUnfriend(
  player: User,
  store: Store<
    "friend",
    { users: User[]; isLoading: boolean },
    {},
    {
      updateUserList(userId: number): Promise<void>;
      removeRelation(player: User): Promise<void>;
      acceptRequest(player: User): Promise<void>;
    }
  >
) {
  await store.removeRelation(player);
}
