import { create } from "zustand";
import { TradeOptions } from "@lib/types/enums";
import { TokenPrice } from "@lib/hooks/useTokenPrice";

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
