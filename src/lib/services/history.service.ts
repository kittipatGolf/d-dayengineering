import { apiClient } from "@/lib/api/api-client";
import type { ProductHistoryItem, RepairHistoryItem } from "@/app/homeadmin/history/component/types";

export const historyService = {
  getRepairHistory: async () => {
    return apiClient.get<RepairHistoryItem[]>("/history/repairs");
  },
  getProductHistory: async () => {
    return apiClient.get<ProductHistoryItem[]>("/history/products");
  },
};
