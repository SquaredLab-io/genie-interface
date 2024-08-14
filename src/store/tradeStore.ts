import { create } from "zustand";
import { TradeOptions } from "@lib/types/enums";
import { TokenPrice } from "@lib/hooks/useTokenPrice";
import { TokenBalance } from "@squaredlab-io/sdk";

interface iTrade {
  isPositionModalOpen: boolean;
  tradeType: string;
  setIsPositionModalOpen: (value: boolean) => void;
  setTradeType: (value: string) => void;
}

interface iPrices {
  tokenPrice: TokenPrice | undefined;
  setTokenPrice: (value: TokenPrice) => void;
  isFetchingPrice: boolean;
  setIsFetchingPrice: (value: boolean) => void;
}

interface iBalances {
  currentPosition: TokenBalance | undefined;
  updateCurrentPosition: (value: TokenBalance) => void;
  isFetchingPosition: boolean;
  updateFetchingPosition: (value: boolean) => void;
}

export const usePricesStore = create<iPrices>((set, get) => ({
  tokenPrice: undefined,
  setTokenPrice: (updatedPrice: TokenPrice) =>
    set(() => ({
      tokenPrice: updatedPrice
    })),
  isFetchingPrice: false,
  setIsFetchingPrice: (update: boolean) =>
    set(() => ({
      isFetchingPrice: update
    }))
}));

export const useBalanceStore = create<iBalances>((set, get) => ({
  currentPosition: undefined,
  updateCurrentPosition: (newPosition: TokenBalance) =>
    set(() => ({
      currentPosition: newPosition
    })),
  isFetchingPosition: false,
  updateFetchingPosition: (fetching: boolean) =>
    set(() => ({
      isFetchingPosition: fetching
    }))
}));

export const useTradeStore = create<iTrade>((set, get) => ({
  // states
  isPositionModalOpen: false,
  tradeType: TradeOptions.long,
  // actions
  setIsPositionModalOpen: (updatedState: boolean) =>
    set(() => ({
      isPositionModalOpen: updatedState
    })),
  setTradeType: (newTradeType: string) =>
    set(() => ({
      tradeType: newTradeType
    }))
}));
