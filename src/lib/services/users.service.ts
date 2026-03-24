import { apiClient } from "@/lib/api/api-client";
import type { AdminUser, UserAddress } from "@/app/homeadmin/users/component/types";

export const usersService = {
  getAll: async () => {
    return apiClient.get<AdminUser[]>("/users");
  },
  update: async (id: string, payload: Partial<Omit<AdminUser, "id" | "addresses">>) => {
    return apiClient.put<AdminUser>(`/users/${id}`, payload);
  },
  remove: async (id: string) => {
    return apiClient.delete<void>(`/users/${id}`);
  },
  updateAddresses: async (id: string, addresses: UserAddress[]) => {
    return apiClient.put<AdminUser>(`/users/${id}/addresses`, { addresses });
  },
};
