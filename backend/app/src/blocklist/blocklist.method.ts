import { Blocklist } from "./blocklist.entity";

export function occursInBlocklist(
  blocklist: Blocklist[],
  userId: number,
): boolean {
  for (const i of blocklist) {
    if (i.id === userId) return true;
  }
  return false;
}
