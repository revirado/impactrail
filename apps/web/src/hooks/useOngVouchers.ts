import { useState, useEffect, useCallback } from "react";
import { voucherService } from "@/services/voucher.service";
import { authService } from "@/services/auth.service";
import { VoucherCategory } from "@impactrail/shared-types";
import type { Voucher, User } from "@impactrail/shared-types";

interface UseOngVouchersReturn {
  vouchers: Voucher[];
  beneficiaries: User[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  dialogOpen: boolean;
  formData: { beneficiaryId: string; amount: string; category: string };
  fetchVouchers: () => Promise<void>;
  setDialogOpen: (open: boolean) => void;
  setFormData: (data: { beneficiaryId: string; amount: string; category: string }) => void;
  createVoucher: (ongId: string) => Promise<void>;
  clearError: () => void;
}

export function useOngVouchers(ongId?: string): UseOngVouchersReturn {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    beneficiaryId: "",
    amount: "",
    category: "",
  });

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vouchs, bens] = await Promise.all([
        voucherService.getAll({ ongId }),
        authService.getUsers("BENEFICIARY"),
      ]);
      setVouchers(vouchs);
      setBeneficiaries(bens);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [ongId]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const createVoucher = useCallback(
    async (currentOngId: string) => {
      if (!currentOngId || !formData.beneficiaryId || !formData.amount || !formData.category) return;
      setCreating(true);
      setError(null);
      try {
        await voucherService.create({
          ongId: currentOngId,
          beneficiaryId: formData.beneficiaryId,
          amount: parseFloat(formData.amount),
          category: formData.category as VoucherCategory,
        });
        setDialogOpen(false);
        setFormData({ beneficiaryId: "", amount: "", category: "" });
        await fetchVouchers();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al crear voucher");
      } finally {
        setCreating(false);
      }
    },
    [formData, fetchVouchers]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    vouchers,
    beneficiaries,
    loading,
    error,
    creating,
    dialogOpen,
    formData,
    fetchVouchers,
    setDialogOpen,
    setFormData,
    createVoucher,
    clearError,
  };
}
