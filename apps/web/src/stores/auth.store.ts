"use client";

import { create } from "zustand";
import type { User } from "@impactrail/shared-types";
import { authService } from "@/services/auth.service";

function setSessionCookie(user: User | null) {
  if (user) {
    document.cookie = `impactrail-session=${JSON.stringify(user)}; path=/; max-age=86400`;
  } else {
    document.cookie = "impactrail-session=; path=/; max-age=0";
  }
}

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
      setSessionCookie(user);
      set({ user, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
    }
  },

  logout: () => {
    setSessionCookie(null);
    set({ user: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
