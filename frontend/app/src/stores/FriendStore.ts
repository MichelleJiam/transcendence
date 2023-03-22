import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";
import type { PublicProfile } from "./UserStore";

export type Relation = {
  source: number;
  target: number;
  status: string /* FRIEND | PENDING | NONE */;
};

interface User extends PublicProfile {
  relation: Relation /* in relation to the current user */;
}

export const useFriendStore = defineStore("friend", {
  state: () => {
    return {
      users: Array<User>(),
      isLoading: true,
    };
  },
  actions: {
    async updateUserList(userId: number) {
      const res = await apiRequest("/friend/relation/users", "get");
      this.users = res.data;
      this.users.forEach(async (user) => {
        const res = await apiRequest(`/user/${user.id}/avatar`, "get");
        user.avatarUrl = res.config.url;
        const rel = await apiRequest(
          `/friend/relation/${userId}/${user.id}`,
          "get"
        );
        user.relation = rel.data;
      });
      this.isLoading = false;
    },

    async removeRelation(player: User) {
      console.debug("removeRelation called");
      await apiRequest("/friend/unfriend", "delete", { data: player.relation });
    },

    async acceptRequest(player: User) {
      await apiRequest("/friend/accept", "put", {
        data: player.relation,
      });
    },
  },
});
