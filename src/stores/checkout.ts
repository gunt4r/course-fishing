import { create } from "zustand";

interface CheckoutState {
  password: string;
  email: string;
  phone: string;
  setPassword: (password: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set: any) => ({
  password: "",
  email: "",
  phone: "",
  setPassword: (password: string) => set({ password }),
  setEmail: (email: string) => set({ email }),
  setPhone: (phone: string) => set({ phone }),
  reset: () => set({ password: "", email: "", phone: "" }),
}));