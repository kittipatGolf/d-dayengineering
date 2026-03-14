import doorPricingJson from "@/mocks/data/door-pricing.json";
import categoriesJson from "@/mocks/data/product-categories.json";
import productHistoryJson from "@/mocks/data/history-products.json";
import ordersJson from "@/mocks/data/orders.json";
import portfolioJson from "@/mocks/data/portfolio.json";
import productsJson from "@/mocks/data/products.json";
import repairRequestsJson from "@/mocks/data/repair-requests.json";
import repairHistoryJson from "@/mocks/data/history-repairs.json";
import usersJson from "@/mocks/data/users.json";
import type { DoorPricingRow } from "@/app/homeadmin/door-pricing/component/types";
import type { ProductHistoryItem, RepairHistoryItem } from "@/app/homeadmin/history/component/types";
import type { OrderRecord } from "@/app/homeadmin/orders/component/types";
import type { PortfolioItem } from "@/app/homeadmin/portfolio/component/types";
import type { ProductCategory } from "@/app/homeadmin/product-categories/component/types";
import type { ProductItem } from "@/app/homeadmin/products/component/types";
import type { RepairRequestItem } from "@/app/homeadmin/repair-requests/component/types";
import type { AdminUser } from "@/app/homeadmin/users/component/types";

export const mockStore = {
  categories: [...(categoriesJson as ProductCategory[])],
  products: [...(productsJson as ProductItem[])],
  portfolio: [...(portfolioJson as PortfolioItem[])],
  doorPricing: [...(doorPricingJson as DoorPricingRow[])],
  users: [...(usersJson as AdminUser[])],
  orders: [...(ordersJson as OrderRecord[])],
  repairRequests: [...(repairRequestsJson as RepairRequestItem[])],
  repairHistory: [...(repairHistoryJson as RepairHistoryItem[])],
  productHistory: [...(productHistoryJson as ProductHistoryItem[])],
};

export function nextId(prefix: string, existingIds: string[]) {
  const max = existingIds.reduce((acc, id) => {
    const match = id.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (!match) return acc;
    const n = Number(match[1]);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);

  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

export function nowThaiDate() {
  return new Date().toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const isMockMode = (process.env.NEXT_PUBLIC_API_MODE ?? "mock") === "mock";
