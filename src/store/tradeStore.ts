import { create } from "zustand";
import { TradeOptions } from "@lib/types/enums";
import { AllPositions } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { isEqual } from "lodash";

interface iTrade {
  isPositionModalOpen: boolean;
  tradeType: string;
  setIsPositionModalOpen: (value: boolean) => void;
  setTradeType: (value: string) => void;
}

interface OrdersState {
  orders: AllPositions | undefined;
  // setOrders: (orders: AllPositions | undefined) => void;
  updateOrders: (newOrders: AllPositions | undefined) => void;
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

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: undefined,
  updateOrders: (newOrders) => {
    if (!isEqual(get().orders, newOrders)) {
      set({ orders: newOrders });
    }
  }
}));
