import { apiClient } from "@/lib/api/api-client";
import type { ProductItem } from "@/app/homeadmin/products/component/types";

export const productsService = {
  getAll: async () => {
    return apiClient.get<ProductItem[]>("/products");
  },
  create: async (payload: Omit<ProductItem, "id" | "updatedAt">) => {
    return apiClient.post<ProductItem>("/products", payload);
  },
  update: async (id: string, payload: Partial<Omit<ProductItem, "id">>) => {
    return apiClient.put<ProductItem>(`/products/${id}`, payload);
  },
  remove: async (id: string) => {
    return apiClient.delete<void>(`/products/${id}`);
  },
};
