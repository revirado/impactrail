import api from "./api";
import type { ApiResponse, User } from "@impactrail/shared-types";

export const authService = {
  async login(email: string): Promise<User> {
    const response = await api.post<ApiResponse<User>>("/auth/login", { email });
    if (!response.data.success) {
      throw new Error(response.data.error || "Login failed");
    }
    return response.data.data!;
  },

  async getUsers(role?: string): Promise<User[]> {
    const params = role ? { role } : {};
    const response = await api.get<ApiResponse<User[]>>("/auth", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch users");
    }
    return response.data.data!;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/auth/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "User not found");
    }
    return response.data.data!;
  },
};
