import { useState, useEffect, useCallback } from "react";
import { voucherService } from "@/services/voucher.service";
import type { Voucher } from "@impactrail/shared-types";

interface UseBeneficiaryVouchersReturn {
  activeVouchers: Voucher[];
  usedVouchers: Voucher[];
  loading: boolean;
  error: string | null;
  selectedVoucher: Voucher | null;
  setSelectedVoucher: (voucher: Voucher | null) => void;
}

export function useBeneficiaryVouchers(
  beneficiaryId?: string
): UseBeneficiaryVouchersReturn {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await voucherService.getAll({ beneficiaryId });
      setVouchers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar vouchers");
    } finally {
      setLoading(false);
    }
  }, [beneficiaryId]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const activeVouchers = vouchers.filter((v) => v.status === "ACTIVE");
  const usedVouchers = vouchers.filter((v) => v.status === "USED");

  return {
    activeVouchers,
    usedVouchers,
    loading,
    error,
    selectedVoucher,
    setSelectedVoucher,
  };
}
