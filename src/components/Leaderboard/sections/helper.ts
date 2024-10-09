export enum LeaderboardOptions {
  leaderboard = "leaderboard",
  stats = "stats"
}

export type LeaderboardData = {
  address: string;
  rank: number;
  multiplier: number;
  tradingVolume: number;
  pnl: number;
  points: number;
};

// Dummy data TBD
export const leaderboard_data: LeaderboardData[] = [
  {
    address: "0x9cdAA94733a682013Ff8AfD72BA59FB63619C98d",
    rank: 121,
    multiplier: 2,
    tradingVolume: 12123,
    pnl: 12123,
    points: 10
  },
  {
    address: "0x8baAA94733a682013Ff8AfD72BA59FB63619C98d",
    rank: 1,
    multiplier: 2,
    tradingVolume: 12123,
    pnl: 12123,
    points: 10
  },
  {
    address: "0x4cdAA94733a682013Ff8AfD72BA59FB63619C98d",
    rank: 2,
    multiplier: 2,
    tradingVolume: 12123,
    pnl: 12123,
    points: 10
  },
  {
    address: "0x2cdAA94733a682013Ff8AfD72BA59FB63619C98d",
    rank: 3,
    multiplier: 2,
    tradingVolume: 12123,
    pnl: 12123,
    points: 10
  }
];