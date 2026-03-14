import { apiClient } from "@/lib/api/api-client";
import { isMockMode, mockStore } from "./mock-store";
import type { ProductHistoryItem, RepairHistoryItem } from "@/app/homeadmin/history/component/types";

const ALLOWED_STATUSES = new Set(["สำเร็จ", "ยกเลิก"]);

export const historyService = {
  getRepairHistory: async () => {
    if (isMockMode) {
      return mockStore.repairHistory.filter((item) => ALLOWED_STATUSES.has(item.status));
    }
    return apiClient.get<RepairHistoryItem[]>("/history/repairs");
  },
  getProductHistory: async () => {
    if (isMockMode) {
      return mockStore.productHistory.filter((item) => ALLOWED_STATUSES.has(item.status));
    }
    return apiClient.get<ProductHistoryItem[]>("/history/products");
  },
};

