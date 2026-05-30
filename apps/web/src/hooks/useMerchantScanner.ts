import { useState, useCallback } from "react";
import { voucherService } from "@/services/voucher.service";
import { transactionService } from "@/services/transaction.service";
import type { Voucher } from "@impactrail/shared-types";

interface UseMerchantScannerReturn {
  qrCode: string;
  voucher: Voucher | null;
  loading: boolean;
  processing: boolean;
  error: string | null;
  success: string | null;
  setQrCode: (code: string) => void;
  searchVoucher: () => Promise<void>;
  approveTransaction: (merchantId: string) => Promise<void>;
  clearMessages: () => void;
}

export function useMerchantScanner(): UseMerchantScannerReturn {
  const [qrCode, setQrCode] = useState("");
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchVoucher = useCallback(async () => {
    if (!qrCode.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    setVoucher(null);
    try {
      const data = await voucherService.getByQr(qrCode.trim().toUpperCase());
      setVoucher(data);
    } catch (err) {
      setError("Voucher no encontrado");
    } finally {
      setLoading(false);
    }
  }, [qrCode]);

  const approveTransaction = useCallback(
    async (merchantId: string) => {
      if (!voucher || !merchantId) return;
      setProcessing(true);
      setError(null);
      try {
        await transactionService.process({
          voucherId: voucher.id,
          merchantId,
        });
        setSuccess(`Transacción aprobada: $${voucher.amount.toLocaleString()}`);
        setVoucher(null);
        setQrCode("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al procesar");
      } finally {
        setProcessing(false);
      }
    },
    [voucher]
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    qrCode,
    voucher,
    loading,
    processing,
    error,
    success,
    setQrCode,
    searchVoucher,
    approveTransaction,
    clearMessages,
  };
}
