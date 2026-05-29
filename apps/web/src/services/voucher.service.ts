import api from "./api";
import type {
  ApiResponse,
  Voucher,
  CreateVoucherRequest,
} from "@impactrail/shared-types";

export const voucherService = {
  async create(data: CreateVoucherRequest): Promise<Voucher> {
    const response = await api.post<ApiResponse<Voucher>>("/vouchers", data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create voucher");
    }
    return response.data.data!;
  },

  async getAll(params?: {
    ongId?: string;
    beneficiaryId?: string;
    status?: string;
  }): Promise<Voucher[]> {
    const response = await api.get<ApiResponse<Voucher[]>>("/vouchers", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch vouchers");
    }
    return response.data.data!;
  },

  async getById(id: string): Promise<Voucher> {
    const response = await api.get<ApiResponse<Voucher>>(`/vouchers/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Voucher not found");
    }
    return response.data.data!;
  },

  async getByQr(qrCode: string): Promise<Voucher> {
    const response = await api.get<ApiResponse<Voucher>>(`/vouchers/qr/${qrCode}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Voucher not found");
    }
    return response.data.data!;
  },
};
