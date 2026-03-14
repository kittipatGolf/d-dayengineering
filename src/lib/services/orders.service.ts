import { apiClient } from "@/lib/api/api-client";
import { isMockMode, mockStore, nowThaiDate } from "./mock-store";
import type { ProductHistoryItem } from "@/app/homeadmin/history/component/types";
import type { OrderItem, OrderRecord, OrderStatus } from "@/app/homeadmin/orders/component/types";

function toHistoryFromOrder(order: OrderRecord, status: "สำเร็จ" | "ยกเลิก"): ProductHistoryItem {
  return {
    id: order.id.replace("OD-", "PH-"),
    firstName: order.firstName,
    lastName: order.lastName,
    phone: order.phone,
    address: order.address,
    items: order.items.map((item) => ({
      id: item.id.replace("OD-", "PH-"),
      name: item.name,
      images: item.images,
      color: item.color,
      widthM: item.widthM,
      lengthM: item.lengthM,
      thickness: item.thickness,
      installOption: item.installOption,
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit,
      warranty: item.warranty,
    })),
    totalAmount: order.totalAmount,
    status,
    completedAt: nowThaiDate(),
  };
}

export const ordersService = {
  getAll: async () => {
    if (isMockMode) return mockStore.orders;
    return apiClient.get<OrderRecord[]>("/orders");
  },
  updateStatus: async (id: string, status: OrderStatus) => {
    if (isMockMode) {
      const index = mockStore.orders.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");

      const order = { ...mockStore.orders[index], status };
      if (status === "สำเร็จ" || status === "ยกเลิก") {
        mockStore.orders = mockStore.orders.filter((item) => item.id !== id);
        mockStore.productHistory = [toHistoryFromOrder(order, status), ...mockStore.productHistory];
        return null;
      }

      mockStore.orders[index] = order;
      return mockStore.orders[index];
    }
    return apiClient.put<OrderRecord | null>(`/orders/${id}/status`, { status });
  },
  updateItems: async (id: string, items: OrderItem[]) => {
    if (isMockMode) {
      const index = mockStore.orders.findIndex((item) => item.id === id);
      if (index === -1) throw new Error("Not found");
      const totalAmount = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
      mockStore.orders[index] = { ...mockStore.orders[index], items, totalAmount };
      return mockStore.orders[index];
    }
    return apiClient.put<OrderRecord>(`/orders/${id}/items`, { items });
  },
};

