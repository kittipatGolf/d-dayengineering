import { apiClient } from "@/lib/api/api-client";
import type { OrderItem, OrderRecord, OrderStatus } from "@/app/homeadmin/orders/component/types";

export const ordersService = {
  getAll: async () => {
    return apiClient.get<OrderRecord[]>("/orders");
  },
  updateStatus: async (id: string, status: OrderStatus) => {
    return apiClient.put<OrderRecord | null>(`/orders/${id}/status`, { status });
  },
  updateItems: async (id: string, items: OrderItem[]) => {
    const totalAmount = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
    return apiClient.put<OrderRecord>(`/orders/${id}/items`, { items, totalAmount });
  },
};
