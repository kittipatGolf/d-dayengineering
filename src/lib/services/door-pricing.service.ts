import { apiClient } from "@/lib/api/api-client";
import type { DoorPricingRow } from "@/app/homeadmin/door-pricing/component/types";

export const doorPricingService = {
  getAll: async () => {
    return apiClient.get<DoorPricingRow[]>("/door-pricing");
  },
  create: async (payload: Omit<DoorPricingRow, "id" | "updatedAt">) => {
    return apiClient.post<DoorPricingRow>("/door-pricing", payload);
  },
  update: async (id: string, payload: Partial<Omit<DoorPricingRow, "id">>) => {
    return apiClient.put<DoorPricingRow>(`/door-pricing/${id}`, payload);
  },
  remove: async (id: string) => {
    return apiClient.delete<void>(`/door-pricing/${id}`);
  },
};
