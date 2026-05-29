import api from "./api";
import type {
  ApiResponse,
  Transaction,
  ProcessTransactionRequest,
} from "@impactrail/shared-types";

export const transactionService = {
  async process(data: ProcessTransactionRequest): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>("/transactions", data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to process transaction");
    }
    return response.data.data!;
  },

  async getAll(params?: {
    merchantId?: string;
    voucherId?: string;
    status?: string;
  }): Promise<Transaction[]> {
    const response = await api.get<ApiResponse<Transaction[]>>("/transactions", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch transactions");
    }
    return response.data.data!;
  },

  async getById(id: string): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Transaction not found");
    }
    return response.data.data!;
  },

  async verify(id: string): Promise<{ valid: boolean; checkpoint?: unknown }> {
    const response = await api.get<ApiResponse<{ valid: boolean; checkpoint?: unknown }>>(
      `/transactions/${id}/verify`
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to verify transaction");
    }
    return response.data.data!;
  },
};
