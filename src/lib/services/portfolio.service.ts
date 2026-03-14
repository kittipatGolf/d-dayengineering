import { apiClient } from "@/lib/api/api-client";
import { isMockMode, mockStore, nextId, nowThaiDate } from "./mock-store";
import type { PortfolioItem } from "@/app/homeadmin/portfolio/component/types";

export const portfolioService = {
  getAll: async () => {
    if (isMockMode) return mockStore.portfolio;
    return apiClient.get<PortfolioItem[]>("/portfolio");
  },
  create: async (payload: Omit<PortfolioItem, "id" | "updatedAt">) => {
    if (isMockMode) {
      const created: PortfolioItem = {
        id: nextId(
          "PF",
          mockStore.portfolio.map((item) => item.id),
        ),
        updatedAt: nowThaiDate(),
        ...payload,
      };
      mockStore.portfolio = [created, ...mockStore.portfolio];
      return created;
    }
    return apiClient.post<PortfolioItem>("/portfolio", payload);
  },
  update: async (id: string, payload: Partial<Omit<PortfolioItem, "id">>) => {
    if (isMockMode) {
      const index = mockStore.portfolio.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");
      mockStore.portfolio[index] = { ...mockStore.portfolio[index], ...payload };
      return mockStore.portfolio[index];
    }
    return apiClient.put<PortfolioItem>(`/portfolio/${id}`, payload);
  },
  remove: async (id: string) => {
    if (isMockMode) {
      mockStore.portfolio = mockStore.portfolio.filter((item) => item.id !== id);
      return;
    }
    return apiClient.delete<void>(`/portfolio/${id}`);
  },
};
