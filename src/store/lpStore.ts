import { create } from "zustand";
import { LpTradeOptions } from "@lib/types/enums";

interface iLp {
  lpTradeOption: LpTradeOptions;
  setLpTradeOption: (value: LpTradeOptions) => void;
}

export const useLpStore = create<iLp>((set, get) => ({
  lpTradeOption: LpTradeOptions.supply,
  setLpTradeOption: (value) =>
    set(() => ({
      lpTradeOption: value
    }))
}));
