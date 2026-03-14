import { apiClient } from "@/lib/api/api-client";
import { isMockMode, mockStore, nowThaiDate } from "./mock-store";
import type { RepairHistoryItem } from "@/app/homeadmin/history/component/types";
import type { RepairRequestItem, RepairRequestStatus } from "@/app/homeadmin/repair-requests/component/types";

function toRepairHistory(item: RepairRequestItem, status: "สำเร็จ" | "ยกเลิก"): RepairHistoryItem {
  return {
    id: item.id.replace("RR-", "RH-"),
    username: item.username,
    images: item.images,
    repairType: item.repairType,
    repairItem: item.repairItem,
    detail: item.detail,
    repairDate: nowThaiDate(),
    address: item.address,
    status,
    price: item.repairPrice,
  };
}

export const repairRequestsService = {
  getAll: async () => {
    if (isMockMode) return mockStore.repairRequests;
    return apiClient.get<RepairRequestItem[]>("/repair-requests");
  },
  updateStatus: async (id: string, status: RepairRequestStatus, repairPrice?: number) => {
    if (isMockMode) {
      const index = mockStore.repairRequests.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");

      const current = mockStore.repairRequests[index];
      const nextPrice = typeof repairPrice === "number" ? repairPrice : current.repairPrice;
      const updated: RepairRequestItem = { ...current, status, repairPrice: nextPrice };

      if (status === "สำเร็จ" || status === "ยกเลิก") {
        mockStore.repairRequests = mockStore.repairRequests.filter((item) => item.id !== id);
        mockStore.repairHistory = [toRepairHistory(updated, status), ...mockStore.repairHistory];
        return null;
      }

      mockStore.repairRequests[index] = updated;
      return updated;
    }
    return apiClient.put<RepairRequestItem | null>(`/repair-requests/${id}/status`, { status, repairPrice });
  },
  updateInitialPrice: async (price: number) => {
    if (isMockMode) {
      mockStore.repairRequests = mockStore.repairRequests.map((item) => {
        if (item.status === "รอการยืนยัน" || item.status === "ได้รับการยืนยัน") {
          return { ...item, repairPrice: price };
        }
        return item;
      });
      return mockStore.repairRequests;
    }
    return apiClient.put<RepairRequestItem[]>("/repair-requests/initial-price", { price });
  },
};
