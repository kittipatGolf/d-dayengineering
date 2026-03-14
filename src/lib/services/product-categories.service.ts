import { apiClient } from "@/lib/api/api-client";
import { isMockMode, mockStore, nextId, nowThaiDate } from "./mock-store";
import type { ProductCategory } from "@/app/homeadmin/product-categories/component/types";

export const productCategoriesService = {
  getAll: async () => {
    if (isMockMode) return mockStore.categories;
    return apiClient.get<ProductCategory[]>("/product-categories");
  },
  create: async (payload: Omit<ProductCategory, "id" | "updatedAt">) => {
    if (isMockMode) {
      const created: ProductCategory = {
        id: nextId(
          "CAT",
          mockStore.categories.map((item) => item.id),
        ),
        updatedAt: nowThaiDate(),
        ...payload,
      };
      mockStore.categories = [created, ...mockStore.categories];
      return created;
    }
    return apiClient.post<ProductCategory>("/product-categories", payload);
  },
  update: async (id: string, payload: Partial<Omit<ProductCategory, "id">>) => {
    if (isMockMode) {
      const index = mockStore.categories.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");
      mockStore.categories[index] = { ...mockStore.categories[index], ...payload };
      return mockStore.categories[index];
    }
    return apiClient.put<ProductCategory>(`/product-categories/${id}`, payload);
  },
  remove: async (id: string) => {
    if (isMockMode) {
      mockStore.categories = mockStore.categories.filter((item) => item.id !== id);
      return;
    }
    return apiClient.delete<void>(`/product-categories/${id}`);
  },
};
