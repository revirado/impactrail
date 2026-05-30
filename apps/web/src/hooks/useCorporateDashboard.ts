import { useState, useEffect, useCallback } from "react";
import { operationService } from "@/services/operation.service";
import type { DashboardStats } from "@impactrail/shared-types";

interface UseCorporateDashboardReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export function useCorporateDashboard(
  donorId?: string
): UseCorporateDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await operationService.getStats(donorId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }, [donorId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, fetchStats };
}
