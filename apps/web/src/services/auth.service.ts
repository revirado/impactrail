import { api } from "./api";
import type { ApiResponse, User } from "@impactrail/shared-types";

export const authService = {
  async login(email: string): Promise<User> {
    const response = await api.post<ApiResponse<User>>("/api/auth", { email });
    if (!response.success) {
      throw new Error(response.error || "Login failed");
    }
    return response.data!;
  },

  async getUsers(role?: string): Promise<User[]> {
    const params = role ? { role } : undefined;
    const response = await api.get<ApiResponse<User[]>>("/api/auth", params);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch users");
    }
    return response.data!;
  },
};
