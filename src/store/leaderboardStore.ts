import { create } from "zustand";
import { LeaderboardOptions } from "@components/Leaderboard/sections/helper";

interface iLeader {
  leaderboardTab: LeaderboardOptions;
  setLeaderboardTab: (value: LeaderboardOptions) => void;
}

export const useLeaderStore = create<iLeader>((set, get) => ({
  leaderboardTab: LeaderboardOptions.leaderboard,
  setLeaderboardTab: (value) =>
    set(() => ({
      leaderboardTab: value
    }))
}));
