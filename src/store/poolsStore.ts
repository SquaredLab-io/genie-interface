import { create } from "zustand";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";

interface iPools {
  poolsData: PoolInfo[];
  selectedPool: () => PoolInfo | undefined;
  isFetchingPools: boolean;
  updatePoolsData: (value: PoolInfo[] | undefined) => void;
  updateSelectedPool: (value: PoolInfo) => void;
  updateIsFetchingPools: (value: boolean) => void;
}

export const usePoolsStore = create<iPools>((set, get) => ({
  poolsData: [],
  selectedPool: () => {
    const state = get();
    // default last pool in array
    return state.poolsData?.[state.poolsData.length - 1];
  },
  isFetchingPools: false,
  // actions
  updatePoolsData: (pools) =>
    set(() => ({
      poolsData: pools
    })),
  updateSelectedPool: (newPool) => {
    set(() => ({
      selectedPool: () => newPool
    }));
  },
  updateIsFetchingPools: (isFetching) => {
    set(() => ({
      isFetchingPools: isFetching
    }));
  }
}));

interface iPoolModalStore {
  openCreateModal: boolean;
  setOpenCreateModal: (value: boolean) => void;
  openManageModal: boolean;
  setOpenManageModal: (value: boolean) => void;
}

export const useModalStore = create<iPoolModalStore>((set, get) => ({
  openCreateModal: false,
  setOpenCreateModal: (value) => {
    set(() => ({
      openCreateModal: value
    }));
  },
  openManageModal: false,
  setOpenManageModal: (value: boolean) => {
    set(() => ({
      openManageModal: value
    }));
  }
}));
