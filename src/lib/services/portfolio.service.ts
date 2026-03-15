import { apiClient } from "@/lib/api/api-client";
import type { PortfolioItem } from "@/app/homeadmin/portfolio/component/types";

export const portfolioService = {
  getAll: async () => {
    return apiClient.get<PortfolioItem[]>("/portfolio");
  },
  create: async (payload: Omit<PortfolioItem, "id" | "updatedAt">) => {
    return apiClient.post<PortfolioItem>("/portfolio", payload);
  },
  update: async (id: string, payload: Partial<Omit<PortfolioItem, "id">>) => {
    return apiClient.put<PortfolioItem>(`/portfolio/${id}`, payload);
  },
  remove: async (id: string) => {
    return apiClient.delete<void>(`/portfolio/${id}`);
  },
};
