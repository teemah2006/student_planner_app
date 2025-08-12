/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface User {
  name: string;
  age: string;
  phone: string;
  country: string;
  region: string;
  educationLevel: string;
  grade: string;
  email: string;
  profileUrl?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates:any) =>
    set((state) => ({
      user: { ...state.user, ...updates }
    })),
      clearUser: () => set({ user: null }),
    }),
    { name: "user-storage" } // localStorage key
  ));
