import api from "./api";
import type {
  ApiResponse,
  Operation,
  CreateOperationRequest,
  DashboardStats,
} from "@impactrail/shared-types";

export const operationService = {
  async create(data: CreateOperationRequest): Promise<Operation> {
    const response = await api.post<ApiResponse<Operation>>("/operations", data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create operation");
    }
    return response.data.data!;
  },

  async getAll(params?: {
    donorId?: string;
    ongId?: string;
    status?: string;
  }): Promise<Operation[]> {
    const response = await api.get<ApiResponse<Operation[]>>("/operations", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch operations");
    }
    return response.data.data!;
  },

  async getById(id: string): Promise<Operation> {
    const response = await api.get<ApiResponse<Operation>>(`/operations/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Operation not found");
    }
    return response.data.data!;
  },

  async getStats(donorId?: string): Promise<DashboardStats> {
    const params = donorId ? { donorId } : {};
    const response = await api.get<ApiResponse<DashboardStats>>("/operations/stats", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch stats");
    }
    return response.data.data!;
  },
};
