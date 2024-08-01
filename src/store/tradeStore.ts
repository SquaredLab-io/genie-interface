import { create } from "zustand";
import { TradeOptions } from "@lib/types/enums";

interface iTrade {
  isPositionModalOpen: boolean;
  tradeType: string;
  setIsPositionModalOpen: (value: boolean) => void;
  setTradeType: (value: string) => void;
}

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
