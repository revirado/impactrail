import { api } from "./api";
import type {
  ApiResponse,
  Transaction,
  ProcessTransactionRequest,
} from "@impactrail/shared-types";

export const transactionService = {
  async process(data: ProcessTransactionRequest): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>("/api/transactions", data);
    if (!response.success) {
      throw new Error(response.error || "Failed to process transaction");
    }
    return response.data!;
  },

  async getAll(params?: {
    merchantId?: string;
    voucherId?: string;
    status?: string;
  }): Promise<Transaction[]> {
    const queryParams: Record<string, string> = {};
    if (params?.merchantId) queryParams.merchantId = params.merchantId;
    if (params?.voucherId) queryParams.voucherId = params.voucherId;
    if (params?.status) queryParams.status = params.status;

    const response = await api.get<ApiResponse<Transaction[]>>("/api/transactions", queryParams);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch transactions");
    }
    return response.data!;
  },
};
