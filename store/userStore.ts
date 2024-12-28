// store/userStore.ts
import { create } from "zustand";

interface UserState {
  user: any;
  setUser: (userData: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (userData: any) => set({ user: userData }),
  clearUser: () => set({ user: null }), // تعيين user كـ null لمسح المستخدم
}));
