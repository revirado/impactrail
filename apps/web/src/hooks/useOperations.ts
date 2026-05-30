import { useState, useEffect, useCallback } from "react";
import { operationService } from "@/services/operation.service";
import { authService } from "@/services/auth.service";
import type { Operation, User } from "@impactrail/shared-types";

interface UseOperationsReturn {
  operations: Operation[];
  ongs: User[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  dialogOpen: boolean;
  formData: { ongId: string; amount: string; description: string };
  fetchOperations: () => Promise<void>;
  setDialogOpen: (open: boolean) => void;
  setFormData: (data: { ongId: string; amount: string; description: string }) => void;
  createOperation: (donorId: string) => Promise<void>;
  clearError: () => void;
}

export function useOperations(donorId?: string): UseOperationsReturn {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [ongs, setOngs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    ongId: "",
    amount: "",
    description: "",
  });

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ops, ongList] = await Promise.all([
        operationService.getAll({ donorId }),
        authService.getUsers("ONG"),
      ]);
      setOperations(ops);
      setOngs(ongList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [donorId]);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const createOperation = useCallback(
    async (currentDonorId: string) => {
      if (!currentDonorId || !formData.ongId || !formData.amount) return;
      setCreating(true);
      setError(null);
      try {
        await operationService.create({
          donorId: currentDonorId,
          ongId: formData.ongId,
          amount: parseFloat(formData.amount),
          description: formData.description,
        });
        setDialogOpen(false);
        setFormData({ ongId: "", amount: "", description: "" });
        await fetchOperations();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al crear operación");
      } finally {
        setCreating(false);
      }
    },
    [formData, fetchOperations]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    operations,
    ongs,
    loading,
    error,
    creating,
    dialogOpen,
    formData,
    fetchOperations,
    setDialogOpen,
    setFormData,
    createOperation,
    clearError,
  };
}
