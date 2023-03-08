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
  FIRST,
  PLAYFIVE,
  WONFIVE,
  LOSTFIVE,
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
  {
    id: Achievements.FIRST,
    icon: "faGamepad",
    name: "Played First Game",
  },
  {
    id: Achievements.PLAYFIVE,
    icon: "faTableTennisPaddleBall",
    name: "Played 5 Games",
  },
  {
    id: Achievements.WONFIVE,
    icon: "faMedal",
    name: "Won 5 games",
  },
  {
    id: Achievements.LOSTFIVE,
    icon: "faSadTear",
    name: "Lost 5 games",
  },
];
