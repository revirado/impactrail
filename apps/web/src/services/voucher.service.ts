import { api } from "./api";
import type {
  ApiResponse,
  Voucher,
  CreateVoucherRequest,
} from "@impactrail/shared-types";

export const voucherService = {
  async create(data: CreateVoucherRequest): Promise<Voucher> {
    const response = await api.post<ApiResponse<Voucher>>("/api/vouchers", data);
    if (!response.success) {
      throw new Error(response.error || "Failed to create voucher");
    }
    return response.data!;
  },

  async getAll(params?: {
    ongId?: string;
    beneficiaryId?: string;
    status?: string;
  }): Promise<Voucher[]> {
    const queryParams: Record<string, string> = {};
    if (params?.ongId) queryParams.ongId = params.ongId;
    if (params?.beneficiaryId) queryParams.beneficiaryId = params.beneficiaryId;
    if (params?.status) queryParams.status = params.status;

    const response = await api.get<ApiResponse<Voucher[]>>("/api/vouchers", queryParams);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch vouchers");
    }
    return response.data!;
  },

  async getByQr(qrCode: string): Promise<Voucher> {
    const response = await api.get<ApiResponse<Voucher[]>>(`/api/vouchers`);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch vouchers");
    }
    const voucher = response.data!.find((v) => v.qrCode === qrCode.toUpperCase());
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return voucher;
  },
};
