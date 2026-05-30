import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/services/transaction.service";
import type { Transaction } from "@impactrail/shared-types";

interface UseMerchantTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
}

export function useMerchantTransactions(
  merchantId?: string
): UseMerchantTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getAll({ merchantId });
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar transacciones");
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, fetchTransactions };
}
