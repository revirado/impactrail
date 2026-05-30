import { useState, useEffect, useCallback } from "react";
import { operationService } from "@/services/operation.service";
import { voucherService } from "@/services/voucher.service";
import type { Operation, Voucher } from "@impactrail/shared-types";

interface UseOngDashboardReturn {
  operations: Operation[];
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
  totalReceived: number;
  activeVouchers: number;
  usedVouchers: number;
}

export function useOngDashboard(ongId?: string): UseOngDashboardReturn {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ops, vouchs] = await Promise.all([
        operationService.getAll({ ongId }),
        voucherService.getAll({ ongId }),
      ]);
      setOperations(ops);
      setVouchers(vouchs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [ongId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalReceived = operations.reduce((sum, op) => sum + op.amount, 0);
  const activeVouchers = vouchers.filter((v) => v.status === "ACTIVE").length;
  const usedVouchers = vouchers.filter((v) => v.status === "USED").length;

  return {
    operations,
    vouchers,
    loading,
    error,
    totalReceived,
    activeVouchers,
    usedVouchers,
  };
}
