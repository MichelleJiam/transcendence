import type { UserStatus } from "@/components/game/pong.types";
import apiRequest from "./apiRequest";

export async function updateUserStatus(userId: number, newStatus: UserStatus) {
  await apiRequest(`/user/${userId}/update-status`, "put", {
    data: { status: newStatus },
  }).catch((err) => {
    console.log("Could not update user status: ", err);
  });
}
