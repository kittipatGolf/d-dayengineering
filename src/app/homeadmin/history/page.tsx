"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { FilterTabs } from "../components/admin-shared/filter-tabs";
import { historyService } from "@/lib/services/history.service";
import { HistoryAddressModal } from "./component/history-address-modal";
import { HistoryProductsTable } from "./component/history-products-table";
import { HistoryProductItemsModal } from "./component/history-product-items-modal";
import { HistoryRepairsTable } from "./component/history-repairs-table";
import { HistorySummaryCards } from "./component/history-summary-cards";
import type {
  HistoryAddress,
  HistoryStatus,
  ProductHistoryItem,
  ProductHistoryLineItem,
  RepairHistoryItem,
} from "./component/types";

type HistoryTab = "ประวัติแจ้งซ่อม" | "ประวัติสินค้า";

export default function HistoryPage() {
  const [tab, setTab] = useState<HistoryTab>("ประวัติแจ้งซ่อม");
  const [keyword, setKeyword] = useState("");
  const [repairStatusFilter, setRepairStatusFilter] = useState<"ทั้งหมด" | HistoryStatus>("ทั้งหมด");
  const [productStatusFilter, setProductStatusFilter] = useState<"ทั้งหมด" | HistoryStatus>("ทั้งหมด");
  const [repairRows, setRepairRows] = useState<RepairHistoryItem[]>([]);
  const [productRows, setProductRows] = useState<ProductHistoryItem[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressModalTitle, setAddressModalTitle] = useState("รายละเอียดที่อยู่");
  const [selectedAddress, setSelectedAddress] = useState<HistoryAddress | null>(null);
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ProductHistoryLineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      historyService.getRepairHistory().then(setRepairRows).catch(() => setRepairRows([])),
      historyService.getProductHistory().then(setProductRows).catch(() => setProductRows([])),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredRepairRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return repairRows.filter((item) => {
      const passStatus = repairStatusFilter === "ทั้งหมด" || item.status === repairStatusFilter;
      if (!passStatus) return false;
      if (!q) return true;
      return [item.username, item.repairType, item.repairItem, item.detail, item.repairDate]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [keyword, repairRows, repairStatusFilter]);

  const filteredProductRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return productRows.filter((item) => {
      const passStatus = productStatusFilter === "ทั้งหมด" || item.status === productStatusFilter;
      if (!passStatus) return false;
      if (!q) return true;
      return [item.firstName, item.lastName, item.phone, item.completedAt, ...item.items.map((line) => line.name)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [keyword, productRows, productStatusFilter]);

  const activeRowsCount = tab === "ประวัติแจ้งซ่อม" ? filteredRepairRows.length : filteredProductRows.length;
  const completedCount =
    tab === "ประวัติแจ้งซ่อม"
      ? filteredRepairRows.filter((item) => item.status === "สำเร็จ").length
      : filteredProductRows.filter((item) => item.status === "สำเร็จ").length;
  const canceledCount =
    tab === "ประวัติแจ้งซ่อม"
      ? filteredRepairRows.filter((item) => item.status === "ยกเลิก").length
      : filteredProductRows.filter((item) => item.status === "ยกเลิก").length;

  const openRepairAddress = (item: RepairHistoryItem) => {
    setAddressModalTitle(`รายละเอียดที่อยู่ (${item.username})`);
    setSelectedAddress(item.address);
    setAddressModalOpen(true);
  };

  const openProductAddress = (item: ProductHistoryItem) => {
    setAddressModalTitle(`รายละเอียดที่อยู่ (${item.firstName} ${item.lastName})`);
    setSelectedAddress(item.address);
    setAddressModalOpen(true);
  };

  const openProductItems = (item: ProductHistoryItem) => {
    setSelectedItems(item.items);
    setItemsModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">ประวัติการใช้งาน</h1>
          <p className="mt-1 text-sm text-blue-200/80">แสดงเฉพาะรายการที่มีสถานะสำเร็จหรือยกเลิก เพื่อใช้ตรวจสอบย้อนหลัง</p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
        </div>
      ) : (
        <>
          <HistorySummaryCards total={activeRowsCount} completed={completedCount} canceled={canceledCount} />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* toolbar: tabs + search */}
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <FilterTabs
                options={["ประวัติแจ้งซ่อม", "ประวัติสินค้า"] as const}
                value={tab}
                onChange={setTab}
                className=""
              />
              <label className="relative block w-full sm:max-w-56">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={tab === "ประวัติแจ้งซ่อม" ? "ค้นหาประวัติแจ้งซ่อม..." : "ค้นหาประวัติสินค้า..."}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            </div>

            {/* status filter */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">สถานะ</span>
              <FilterTabs
                options={["ทั้งหมด", "สำเร็จ", "ยกเลิก"] as const}
                value={tab === "ประวัติแจ้งซ่อม" ? repairStatusFilter : productStatusFilter}
                onChange={(value) => {
                  if (tab === "ประวัติแจ้งซ่อม") {
                    setRepairStatusFilter(value);
                  } else {
                    setProductStatusFilter(value);
                  }
                }}
                className=""
              />
            </div>

            {tab === "ประวัติแจ้งซ่อม" ? (
              <HistoryRepairsTable rows={filteredRepairRows} onOpenAddress={openRepairAddress} />
            ) : (
              <HistoryProductsTable
                rows={filteredProductRows}
                onOpenAddress={openProductAddress}
                onOpenItems={openProductItems}
              />
            )}
          </div>
        </>
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
      <HistoryProductItemsModal
        open={itemsModalOpen}
        items={selectedItems}
        onClose={() => {
          setItemsModalOpen(false);
          setSelectedItems([]);
        }}
      />
    </div>
  );
}
