"use client";

import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { FilterTabs } from "../components/admin-shared/filter-tabs";
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

  useEffect(() => {
    repairRequestsService
      .getAll()
      .then((items) => setRows(items.filter((item) => isActiveStatus(item.status))))
      .catch(() => setRows([]));

    fetch("/api/products")
      .then((r) => r.json())
      .then((products: { id: string; name: string; kind: string; price: number | null }[]) =>
        setParts(products.filter((p) => p.kind === "อะไหล่").map((p) => ({ id: p.id, name: p.name, price: p.price }))),
      )
      .catch(() => {});
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
    } catch {
      // ignore
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
              placeholder="ค้นหาข้อมูลส่งซ่อม"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
            />
          </label>
          <button
            type="button"
            onClick={openInitialPriceModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <PencilSquareIcon className="h-4 w-4" />
            แก้ไขราคาซ่อมเริ่มต้น
          </button>
        </div>

        <RepairRequestsTable rows={filteredRows} parts={parts} onOpenAddress={openAddress} onChangeStatus={onChangeStatus} onSelectPart={onSelectPart} />
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
