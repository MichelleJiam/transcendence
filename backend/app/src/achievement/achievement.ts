interface Achievement {
  id: number;
  name: string;
  description: string;
}

export enum Achievements {
  AVATAR,
  WON,
  LOST,
  TWOFA,
  NAME,
  TEST,
}

export const achievements: Achievement[] = [
  {
    id: Achievements.AVATAR,
    name: "The Avatar Makeover",
    description: "Who knew a digital glow-up could be so rewarding!",
  },
  {
    id: Achievements.WON,
    name: "Newbie Crusher",
    description: "First win",
  },
  {
    id: Achievements.LOST,
    name: "The Duke of Defeat",
    description: "First lost",
  },
  {
    id: Achievements.TWOFA,
    name: "Fort Knox",
    description: "2FA enabled",
  },
  {
    id: Achievements.NAME,
    name: "New Player Name",
    description: "New Player Name",
  },
  {
    id: Achievements.TEST,
    name: "test",
    description: "hello",
  },
];
