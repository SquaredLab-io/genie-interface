import { create } from "zustand";
import { PoolInfo } from "@squaredlab-io/sdk/src";


interface iPools {
  poolsData: PoolInfo[];
  selectedPool: () => PoolInfo | undefined;
  updatePoolsData: (value: PoolInfo[] | undefined) => void;
  updateSelectedPool: (value: PoolInfo) => void;
}

export const usePoolsStore = create<iPools>((set, get) => ({
  poolsData: [],
  selectedPool: () => {
    const state = get();
    return state.poolsData?.[0];
  },
  // actions
  updateSelectedPool: (newPool) => {
    set(() => ({
      selectedPool: () => newPool
    }));
  },
  updatePoolsData: (pools) =>
    set(() => ({
      poolsData: pools
    }))
}));
