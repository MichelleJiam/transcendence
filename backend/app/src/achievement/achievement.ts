interface Achievement {
  id: number;
  icon: string;
  name: string;
}

export enum Achievements {
  AVATAR,
  WON,
  LOST,
  TWOFA,
  NAME,
}

export const achievements: Achievement[] = [
  {
    id: Achievements.AVATAR,
    icon: "faFileImage",
    name: "Updated Avatar",
  },
  {
    id: Achievements.WON,
    icon: "faTrophy",
    name: "Won First Game",
  },
  {
    id: Achievements.LOST,
    icon: "faThumbsDown",
    name: "Lost First Game",
  },
  {
    id: Achievements.TWOFA,
    icon: "faHelmetSafety",
    name: "Enabled 2FA",
  },
  {
    id: Achievements.NAME,
    icon: "faPenToSquare",
    name: "Updated Player Name",
  },
];
