"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { HistoryAddressModal } from "../history/component/history-address-modal";
import { FilterTabs } from "../components/admin-shared/filter-tabs";
import { ordersService } from "@/lib/services/orders.service";
import { productCategoriesService } from "@/lib/services/product-categories.service";
import { OrderItemsModal } from "./component/order-items-modal";
import { OrderQuoteModal } from "./component/order-quote-modal";
import { OrdersTable } from "./component/orders-table";
import type { HistoryAddress } from "../history/component/types";
import type { OrderItem, OrderRecord, OrderStatus } from "./component/types";
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

  useEffect(() => {
    ordersService
      .getAll()
      .then((rows) => setOrders(rows.filter((item) => isActiveOrderStatus(item.status))))
      .catch(() => setOrders([]));

    productCategoriesService
      .getAll()
      .then((rows) => setDoorCategories(rows.filter((item) => item.kind === "ประตูม้วน")))
      .catch(() => setDoorCategories([]));
  }, []);

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
    const updated = await ordersService.updateStatus(id, status);
    if (!updated) {
      setOrders((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setOrders((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const saveItems = async (items: OrderItem[]) => {
    if (!selectedOrderId) return;
    const updated = await ordersService.updateItems(selectedOrderId, items);
    setOrders((prev) => prev.map((item) => (item.id === selectedOrderId ? updated : item)));
    setSelectedItems(updated.items);
    setItemsModalOpen(false);
  };

  const getColorOptions = (item: OrderItem) => {
    const category = doorCategories.find((row) => row.name === item.categoryName);
    const base = category?.colors?.length ? category.colors : [];
    const fallback = item.color && !base.includes(item.color) ? [item.color, ...base] : base;
    if (fallback.length > 0) return fallback;
    return item.color ? [item.color] : ["-"];
  };

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-linear-to-r from-blue-900 to-blue-700 px-5 py-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">การจัดการคำสั่งซื้อ</h1>
        <p className="mt-1 text-sm text-blue-100">
          จัดการออเดอร์ที่กำลังดำเนินการ และเปลี่ยนสถานะได้ทันทีจากตาราง
        </p>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterTabs
            options={["ทั้งหมด", "รอการยืนยัน", "ได้รับการยืนยัน"] as const}
            value={tab}
            onChange={setTab}
            className="mt-0 grow"
          />
          <label className="relative block w-full max-w-[300px]">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="ค้นหาข้อมูลคำสั่งซื้อ"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
            />
          </label>
        </div>

        <OrdersTable
          rows={filteredRows}
          onOpenAddress={openAddress}
          onOpenItems={openItems}
          onOpenSummary={openSummary}
          onChangeStatus={changeStatus}
        />
      </section>

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
