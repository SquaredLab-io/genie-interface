import { create } from "zustand";

interface iTrade {
  isPositionModalOpen: boolean;
  setIsPositionModalOpen: (value: boolean) => void;
  selectedPool: string;
  setSelectedPool: (value: string) => void;
}

export const useTradeStore = create<iTrade>((set) => ({
  // states
  selectedPool: "ETH/USDC",
  isPositionModalOpen: false,
  // actions
  setSelectedPool: (newPool: string) =>
    set(() => ({
      selectedPool: newPool
    })),
  setIsPositionModalOpen: (updatedState: boolean) =>
    set(() => ({
      isPositionModalOpen: updatedState
    }))
}));
