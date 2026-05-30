"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import LandingPageClient from "./components/landing/PageClient";

export default function HomePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const getDashboardPath = useCallback((role: string): string => {
    switch (role) {
      case "CORPORATE": return "/corporate";
      case "ONG": return "/ong";
      case "BENEFICIARY": return "/beneficiary";
      case "MERCHANT": return "/merchant";
      default: return "/login";
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router, getDashboardPath]);

  if (user) {
    return null;
  }

  return <LandingPageClient />;
}
