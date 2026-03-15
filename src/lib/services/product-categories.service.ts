import { apiClient } from "@/lib/api/api-client";
import type { ProductCategory } from "@/app/homeadmin/product-categories/component/types";

export const productCategoriesService = {
  getAll: async () => {
    return apiClient.get<ProductCategory[]>("/product-categories");
  },
  create: async (payload: Omit<ProductCategory, "id" | "updatedAt">) => {
    return apiClient.post<ProductCategory>("/product-categories", payload);
  },
  update: async (id: string, payload: Partial<Omit<ProductCategory, "id">>) => {
    return apiClient.put<ProductCategory>(`/product-categories/${id}`, payload);
  },
  remove: async (id: string) => {
    return apiClient.delete<void>(`/product-categories/${id}`);
  },
};
