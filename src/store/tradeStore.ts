import { PoolOptions, potentiaPools } from "@lib/pools";
import { Pool, UnderlyingToken } from "@lib/types/common";
import { TradeOptions } from "@lib/types/enums";
// import { Address } from "viem";
import { create } from "zustand";

interface iTrade {
  selectedPool: Pool;
  SELECTED_TOKEN: () => UnderlyingToken;
  isPositionModalOpen: boolean;
  tradeType: string;
  updateSelectedPool: (value: Pool) => void;
  setIsPositionModalOpen: (value: boolean) => void;
  setTradeType: (value: string) => void;
}

export const useTradeStore = create<iTrade>((set, get) => ({
  // states
  selectedPool: potentiaPools[PoolOptions.weth],
  overviewPool: potentiaPools[PoolOptions.weth],
  SELECTED_TOKEN: () => {
    const state = get();
    return state.selectedPool.underlyingTokens[0];
  },
  isPositionModalOpen: false,
  tradeType: TradeOptions.long,
  // actions
  updateSelectedPool: (newPool: Pool) =>
    set(() => ({
      selectedPool: potentiaPools[newPool.underlyingTokens[0].symbol.toLowerCase()]
    })),
  setIsPositionModalOpen: (updatedState: boolean) =>
    set(() => ({
      isPositionModalOpen: updatedState
    })),
  setTradeType: (newTradeType: string) =>
    set(() => ({
      tradeType: newTradeType
    }))
}));
