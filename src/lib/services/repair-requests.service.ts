import { apiClient } from "@/lib/api/api-client";
import type { RepairRequestItem, RepairRequestStatus } from "@/app/homeadmin/repair-requests/component/types";

export const repairRequestsService = {
  getAll: async () => {
    return apiClient.get<RepairRequestItem[]>("/repair-requests");
  },
  updateStatus: async (id: string, status: RepairRequestStatus, repairPrice?: number) => {
    return apiClient.put<RepairRequestItem | null>(`/repair-requests/${id}/status`, { status, repairPrice });
  },
  updateInitialPrice: async (price: number) => {
    return apiClient.put<RepairRequestItem[]>("/repair-requests/initial-price", { price });
  },
  updateFields: async (id: string, fields: Partial<Pick<RepairRequestItem, "selectedPart" | "warranty" | "repairPrice">>) => {
    return apiClient.patch<RepairRequestItem>(`/repair-requests/${id}`, fields);
  },
};
