import { apiClient } from "@/lib/api/api-client";
import { isMockMode, mockStore, nextId, nowThaiDate } from "./mock-store";
import type { DoorPricingRow } from "@/app/homeadmin/door-pricing/component/types";

export const doorPricingService = {
  getAll: async () => {
    if (isMockMode) return mockStore.doorPricing;
    return apiClient.get<DoorPricingRow[]>("/door-pricing");
  },
  create: async (payload: Omit<DoorPricingRow, "id" | "updatedAt">) => {
    if (isMockMode) {
      const created: DoorPricingRow = {
        id: nextId(
          "DP",
          mockStore.doorPricing.map((item) => item.id),
        ),
        updatedAt: nowThaiDate(),
        ...payload,
      };
      mockStore.doorPricing = [created, ...mockStore.doorPricing];
      return created;
    }
    return apiClient.post<DoorPricingRow>("/door-pricing", payload);
  },
  update: async (id: string, payload: Partial<Omit<DoorPricingRow, "id">>) => {
    if (isMockMode) {
      const index = mockStore.doorPricing.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");
      mockStore.doorPricing[index] = { ...mockStore.doorPricing[index], ...payload };
      return mockStore.doorPricing[index];
    }
    return apiClient.put<DoorPricingRow>(`/door-pricing/${id}`, payload);
  },
  remove: async (id: string) => {
    if (isMockMode) {
      mockStore.doorPricing = mockStore.doorPricing.filter((item) => item.id !== id);
      return;
    }
    return apiClient.delete<void>(`/door-pricing/${id}`);
  },
};
