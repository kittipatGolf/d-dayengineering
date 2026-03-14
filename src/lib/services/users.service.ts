import { apiClient } from "@/lib/api/api-client";
import { isMockMode, mockStore } from "./mock-store";
import type { AdminUser, UserAddress } from "@/app/homeadmin/users/component/types";

export const usersService = {
  getAll: async () => {
    if (isMockMode) return mockStore.users;
    return apiClient.get<AdminUser[]>("/users");
  },
  update: async (id: string, payload: Partial<Omit<AdminUser, "id" | "addresses">>) => {
    if (isMockMode) {
      const index = mockStore.users.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");
      mockStore.users[index] = { ...mockStore.users[index], ...payload };
      return mockStore.users[index];
    }
    return apiClient.put<AdminUser>(`/users/${id}`, payload);
  },
  remove: async (id: string) => {
    if (isMockMode) {
      mockStore.users = mockStore.users.filter((item) => item.id !== id);
      return;
    }
    return apiClient.delete<void>(`/users/${id}`);
  },
  updateAddresses: async (id: string, addresses: UserAddress[]) => {
    if (isMockMode) {
      const index = mockStore.users.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");
      mockStore.users[index] = { ...mockStore.users[index], addresses };
      return mockStore.users[index];
    }
    return apiClient.put<AdminUser>(`/users/${id}/addresses`, { addresses });
  },
};
