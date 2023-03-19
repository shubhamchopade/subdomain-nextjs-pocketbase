import { create } from "zustand";

export const useAuthState = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  token: null,
  setToken: (token) => set({ token }),
}));
