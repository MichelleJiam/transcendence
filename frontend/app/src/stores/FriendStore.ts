import { defineStore } from "pinia";
import { ref } from "vue";
import { apiRequest } from "@/utils/apiRequest";

export type Relation = {
  source: number;
  target: number;
  status: string /* FRIEND | PENDING | NONE */;
};

export type User = {
  id: number;
  playerName: string;
  status: string /* ONLINE | OFFLINE | GAME */;
  relation: Relation /* in relation to the current user */;
};

export const useFriendStore = defineStore("friend", () => {
  const users = ref(Array<User>());

  /* fetch all users from the database and their relation to the current user */

  async function updateUserList(userId: string) {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const res = await apiRequest("/friend/relation/users", "get");
    users.value = res.data;
    users.value.forEach(async (user) => {
      const res = await apiRequest(
        `/friend/relation/${userId}/${user.id}`,
        "get"
      );
      user.relation = res.data;
    });
  }

  async function removeRelation(player: User) {
    await apiRequest("/friend/unfriend", "delete", { data: player.relation });
  }

  async function acceptRequest(player: User) {
    await apiRequest("/friend/accept", "put", {
      data: player.relation,
    });
  }
  return {
    users,
    updateUserList,
    removeRelation,
    acceptRequest,
  };
});
