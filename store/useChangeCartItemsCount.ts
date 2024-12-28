// store/userStore.ts
import { create } from "zustand";

interface ChangeCartItemsCountType {
  countBoolean: any;
  setBoolean: (userData: any) => void;
}

export const useChangeCartItemsCount = create<ChangeCartItemsCountType>(
  (set) => ({
    countBoolean: null,
    setBoolean: (value:any) => set({ countBoolean: value }),
  })
);
