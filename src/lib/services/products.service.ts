import { apiClient } from "@/lib/api/api-client";
import { isMockMode, mockStore, nextId, nowThaiDate } from "./mock-store";
import type { ProductItem } from "@/app/homeadmin/products/component/types";

export const productsService = {
  getAll: async () => {
    if (isMockMode) return mockStore.products;
    return apiClient.get<ProductItem[]>("/products");
  },
  create: async (payload: Omit<ProductItem, "id" | "updatedAt">) => {
    if (isMockMode) {
      const created: ProductItem = {
        id: nextId(
          "PD",
          mockStore.products.map((item) => item.id),
        ),
        updatedAt: nowThaiDate(),
        ...payload,
      };
      mockStore.products = [created, ...mockStore.products];
      return created;
    }
    return apiClient.post<ProductItem>("/products", payload);
  },
  update: async (id: string, payload: Partial<Omit<ProductItem, "id">>) => {
    if (isMockMode) {
      const index = mockStore.products.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");
      mockStore.products[index] = { ...mockStore.products[index], ...payload };
      return mockStore.products[index];
    }
    return apiClient.put<ProductItem>(`/products/${id}`, payload);
  },
  remove: async (id: string) => {
    if (isMockMode) {
      mockStore.products = mockStore.products.filter((item) => item.id !== id);
      return;
    }
    return apiClient.delete<void>(`/products/${id}`);
  },
};
