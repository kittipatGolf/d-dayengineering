"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HistoryAddressModal } from "../history/component/history-address-modal";
import { ordersService } from "@/lib/services/orders.service";
import { productCategoriesService } from "@/lib/services/product-categories.service";
import { OrderItemsModal } from "./component/order-items-modal";
import { OrderQuoteModal } from "./component/order-quote-modal";
import { OrdersTable } from "./component/orders-table";
import type { HistoryAddress } from "../history/component/types";
import type { OrderItem, OrderRecord, OrderStatus } from "./component/types";
import { SuccessToast } from "@/components/success-toast";
import type { ProductCategory } from "../product-categories/component/types";

type ActiveTab = "ทั้งหมด" | "รอการยืนยัน" | "ได้รับการยืนยัน";

function isActiveOrderStatus(status: OrderStatus) {
  return status === "รอการยืนยัน" || status === "ได้รับการยืนยัน";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [tab, setTab] = useState<ActiveTab>("ทั้งหมด");
  const [keyword, setKeyword] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressModalTitle, setAddressModalTitle] = useState("รายละเอียดที่อยู่");
  const [selectedAddress, setSelectedAddress] = useState<HistoryAddress | null>(null);
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedOrderForQuote, setSelectedOrderForQuote] = useState<OrderRecord | null>(null);
  const [doorCategories, setDoorCategories] = useState<ProductCategory[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const rows = await ordersService.getAll();
      setOrders(rows.filter((item) => isActiveOrderStatus(item.status)));
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetchOrders(),
      productCategoriesService
        .getAll()
        .then((rows) => setDoorCategories(rows.filter((item) => item.kind === "ประตูม้วน")))
        .catch(() => setDoorCategories([])),
    ]).finally(() => setLoading(false));
  }, [fetchOrders]);

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return orders.filter((item) => {
      const passTab = tab === "ทั้งหมด" || item.status === tab;
      if (!passTab) return false;
      if (!q) return true;
      return [item.id, item.firstName, item.lastName, item.phone, ...item.items.map((line) => line.name)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [keyword, orders, tab]);

  const openAddress = (order: OrderRecord) => {
    setAddressModalTitle(`รายละเอียดที่อยู่ (${order.firstName} ${order.lastName})`);
    setSelectedAddress(order.address);
    setAddressModalOpen(true);
  };

  const openItems = (order: OrderRecord) => {
    setSelectedOrderId(order.id);
    setSelectedItems(order.items);
    setItemsModalOpen(true);
  };

  const openSummary = (order: OrderRecord) => {
    setSelectedOrderForQuote(order);
    setQuoteModalOpen(true);
  };

  const changeStatus = async (id: string, status: OrderStatus) => {
    await ordersService.updateStatus(id, status);
    await fetchOrders();
    setToast("เปลี่ยนสถานะคำสั่งซื้อสำเร็จ");
  };

  const saveItems = async (items: OrderItem[]) => {
    if (!selectedOrderId) return;
    const updated = await ordersService.updateItems(selectedOrderId, items);
    await fetchOrders();
    setSelectedItems(updated.items);
    setItemsModalOpen(false);
    setToast("บันทึกรายการสินค้าสำเร็จ");
  };

  const getColorOptions = (item: OrderItem) => {
    const category = doorCategories.find((row) => row.name === item.categoryName);
    const base = category?.colors?.length ? category.colors : [];
    const fallback = item.color && !base.includes(item.color) ? [item.color, ...base] : base;
    if (fallback.length > 0) return fallback;
    return item.color ? [item.color] : ["-"];
  };

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">การจัดการคำสั่งซื้อ</h1>
          <p className="mt-1 text-sm text-blue-200/80">
            จัดการออเดอร์ที่กำลังดำเนินการ และเปลี่ยนสถานะได้ทันทีจากตาราง
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
        </div>
      ) : (
        <OrdersTable
          rows={filteredRows}
          activeTab={tab}
          onTabChange={setTab}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onOpenAddress={openAddress}
          onOpenItems={openItems}
          onOpenSummary={openSummary}
          onChangeStatus={changeStatus}
        />
      )}

      <HistoryAddressModal
        open={addressModalOpen}
        title={addressModalTitle}
        address={selectedAddress}
        onClose={() => {
          setAddressModalOpen(false);
          setSelectedAddress(null);
        }}
      />
      <OrderItemsModal
        key={selectedOrderId ?? "no-order-selected"}
        open={itemsModalOpen}
        items={selectedItems}
        getColorOptions={getColorOptions}
        onClose={() => setItemsModalOpen(false)}
        onSave={saveItems}
      />
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      <OrderQuoteModal
        open={quoteModalOpen}
        order={selectedOrderForQuote}
        onClose={() => {
          setQuoteModalOpen(false);
          setSelectedOrderForQuote(null);
        }}
      />
    </div>
  );
}
