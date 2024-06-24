import { create } from "zustand";

interface iTrade {
  isPositionModalOpen: boolean;
  setIsPositionModalOpen: (value: boolean) => void;
}

export const useTradeStore = create<iTrade>((set) => ({
  isPositionModalOpen: false,
  setIsPositionModalOpen: (updatedState: boolean) =>
    set(() => ({
      isPositionModalOpen: updatedState
    }))
}));
