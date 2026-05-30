import { api } from "./api";
import type {
  ApiResponse,
  Operation,
  CreateOperationRequest,
  DashboardStats,
} from "@impactrail/shared-types";

export const operationService = {
  async create(data: CreateOperationRequest): Promise<Operation> {
    const response = await api.post<ApiResponse<Operation>>("/api/operations", data);
    if (!response.success) {
      throw new Error(response.error || "Failed to create operation");
    }
    return response.data!;
  },

  async getAll(params?: {
    donorId?: string;
    ongId?: string;
    status?: string;
  }): Promise<Operation[]> {
    const queryParams: Record<string, string> = {};
    if (params?.donorId) queryParams.donorId = params.donorId;
    if (params?.ongId) queryParams.ongId = params.ongId;
    if (params?.status) queryParams.status = params.status;

    const response = await api.get<ApiResponse<Operation[]>>("/api/operations", queryParams);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch operations");
    }
    return response.data!;
  },

  async getStats(donorId?: string): Promise<DashboardStats> {
    const params = donorId ? { donorId } : undefined;
    const response = await api.get<ApiResponse<DashboardStats>>("/api/operations/stats", params);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch stats");
    }
    return response.data!;
  },
};
