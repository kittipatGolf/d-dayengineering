"use client";

import { useEffect, useMemo, useState } from "react";
import { HistoryAddressModal } from "../history/component/history-address-modal";
import { repairRequestsService } from "@/lib/services/repair-requests.service";
import { RepairPriceModal } from "./component/repair-price-modal";
import { RepairRequestsTable } from "./component/repair-requests-table";
import type { HistoryAddress } from "../history/component/types";
import { SuccessToast } from "@/components/success-toast";
import type { RepairRequestItem, RepairRequestStatus } from "./component/types";

type ActiveTab = "ทั้งหมด" | "รอการยืนยัน" | "ได้รับการยืนยัน";

function isActiveStatus(status: RepairRequestStatus) {
  return status === "รอการยืนยัน" || status === "ได้รับการยืนยัน";
}

export default function RepairRequestsPage() {
  const [rows, setRows] = useState<RepairRequestItem[]>([]);
  const [tab, setTab] = useState<ActiveTab>("ทั้งหมด");
  const [keyword, setKeyword] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressModalTitle, setAddressModalTitle] = useState("รายละเอียดที่อยู่");
  const [selectedAddress, setSelectedAddress] = useState<HistoryAddress | null>(null);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [priceModalMode, setPriceModalMode] = useState<"initial" | "complete">("complete");
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(null);
  const [repairPriceInput, setRepairPriceInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [parts, setParts] = useState<{ id: string; name: string; price: number | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      repairRequestsService
        .getAll()
        .then((items) => setRows(items.filter((item) => isActiveStatus(item.status))))
        .catch((err) => { console.error("Failed to fetch repair requests:", err); setRows([]); }),
      fetch("/api/products")
        .then((r) => r.json())
        .then((products: { id: string; name: string; kind: string; price: number | null }[]) =>
          setParts(products.filter((p) => p.kind === "อะไหล่").map((p) => ({ id: p.id, name: p.name, price: p.price }))),
        )
        .catch((err) => console.error("Failed to fetch parts:", err)),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return rows.filter((item) => {
      const passTab = tab === "ทั้งหมด" || item.status === tab;
      if (!passTab) return false;
      if (!q) return true;
      return [item.id, item.username, item.repairType, item.repairItem, item.detail, item.selectedPart]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [keyword, rows, tab]);

  const openAddress = (item: RepairRequestItem) => {
    setAddressModalTitle(`รายละเอียดที่อยู่ (${item.username})`);
    setSelectedAddress(item.address);
    setAddressModalOpen(true);
  };

  const onChangeStatus = async (id: string, status: RepairRequestStatus) => {
    if (status === "สำเร็จ") {
      const target = rows.find((item) => item.id === id);
      setPriceModalMode("complete");
      setPendingCompleteId(id);
      setRepairPriceInput(target ? String(target.repairPrice) : "");
      setPriceModalOpen(true);
      return;
    }

    const updated = await repairRequestsService.updateStatus(id, status);
    if (!updated) {
      setRows((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setRows((prev) => prev.map((item) => (item.id === id ? updated : item)));
    setToast("เปลี่ยนสถานะสำเร็จ");
  };

  const confirmCompleteWithPrice = async () => {
    if (!pendingCompleteId) return;
    const price = Number(repairPriceInput);
    if (!Number.isFinite(price) || price < 0) return;

    const updated = await repairRequestsService.updateStatus(pendingCompleteId, "สำเร็จ", price);
    if (!updated) {
      setRows((prev) => prev.filter((item) => item.id !== pendingCompleteId));
    } else {
      setRows((prev) => prev.map((item) => (item.id === pendingCompleteId ? updated : item)));
    }
    setPriceModalOpen(false);
    setPendingCompleteId(null);
    setRepairPriceInput("");
    setToast("ปิดงานซ่อมสำเร็จ");
  };

  const onSelectPart = async (id: string, partName: string) => {
    try {
      const updated = await repairRequestsService.updateFields(id, { selectedPart: partName });
      setRows((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
      setToast("เลือกอะไหล่สำเร็จ");
    } catch (err) {
      console.error("Failed to select part:", err);
    }
  };

  const openInitialPriceModal = () => {
    setPriceModalMode("initial");
    setRepairPriceInput(rows[0] ? String(rows[0].repairPrice) : "");
    setPriceModalOpen(true);
  };

  const confirmInitialPrice = async () => {
    const price = Number(repairPriceInput);
    if (!Number.isFinite(price) || price < 0) return;
    const updatedRows = await repairRequestsService.updateInitialPrice(price);
    setRows(updatedRows.filter((item) => isActiveStatus(item.status)));
    setPriceModalOpen(false);
    setRepairPriceInput("");
    setToast("อัปเดตราคาซ่อมเริ่มต้นสำเร็จ");
  };

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">การจัดการคำขอแจ้งซ่อม</h1>
          <p className="mt-1 text-sm text-blue-200/80">
            ติดตามคำขอแจ้งซ่อม ปรับสถานะงาน และยืนยันราคาซ่อมก่อนปิดงาน
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
        </div>
      ) : (
        <RepairRequestsTable
          rows={filteredRows}
          parts={parts}
          activeTab={tab}
          onTabChange={setTab}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onOpenAddress={openAddress}
          onChangeStatus={onChangeStatus}
          onSelectPart={onSelectPart}
          onEditInitialPrice={openInitialPriceModal}
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

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      <RepairPriceModal
        open={priceModalOpen}
        price={repairPriceInput}
        onPriceChange={setRepairPriceInput}
        onClose={() => {
          setPriceModalOpen(false);
          setPendingCompleteId(null);
          setPriceModalMode("complete");
          setRepairPriceInput("");
        }}
        onConfirm={priceModalMode === "complete" ? confirmCompleteWithPrice : confirmInitialPrice}
      />
    </div>
  );
}
