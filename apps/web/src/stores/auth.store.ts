import { create } from "zustand";
import type { User } from "@impactrail/shared-types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(email);
      set({ user, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
    }
  },

  logout: () => {
    set({ user: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
