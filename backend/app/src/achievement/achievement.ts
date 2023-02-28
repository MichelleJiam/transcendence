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
}

export const achievementTypes: Achievement[] = [
  {
    id: Achievements.AVATAR,
    name: "The Avatar Makeover",
    description: "Who knew a digital glow-up could be so rewarding!",
  },
  {
    id: Achievements.WON,
    name: "Newbie Crusher",
    description: "First win! It's all downhill from here, folks!",
  },
  {
    id: Achievements.LOST,
    name: "The Duke of Defeat",
    description:
      "First lost! Bow down to their excellence in underachievement!",
  },
  {
    id: Achievements.TWOFA,
    name: "Fort Knox",
    description: "2FA enabled. Good luck cracking this account, hackers!",
  },
];
