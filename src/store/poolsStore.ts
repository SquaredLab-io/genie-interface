import { PoolOptions, potentiaPools } from "@lib/pools";
import { Pool } from "@lib/types/common";
import { PoolInfo } from "@lib/types/pools";
import { create } from "zustand";

interface iPools {
  overviewPool: Pool;
  poolsData: PoolInfo[] | undefined;
  updateOverviewPool: (value: Pool) => void;
  updatePoolsData: (value: PoolInfo[]) => void;
}

export const usePoolsStore = create<iPools>((set, get) => ({
  overviewPool: potentiaPools[PoolOptions.weth],
  poolsData: undefined,
  // actions
  updateOverviewPool: (newPool: Pool) =>
    set(() => ({
      overviewPool: potentiaPools[newPool.underlyingTokens[0].symbol.toLowerCase()]
    })),
  updatePoolsData: (pools: PoolInfo[]) =>
    set(() => ({
      poolsData: pools
    }))
}));
