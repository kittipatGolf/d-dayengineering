"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TagIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import defaultColors from "@/mocks/data/default-colors.json";
import { productCategoriesService } from "@/lib/services/product-categories.service";
import { ProductCategoriesTable } from "./component/product-categories-table";
import { ProductCategoryForm } from "./component/product-category-form";
import { AlertModal } from "@/components/alert-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import { SuccessToast } from "@/components/success-toast";
import type { CategoryKind, ProductCategory } from "./component/types";

function formatThaiDate(date = new Date()) {
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [activeTab, setActiveTab] = useState<"ทั้งหมด" | CategoryKind>("ทั้งหมด");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [kind, setKind] = useState<CategoryKind>("ประตูม้วน");
  const [isActive, setIsActive] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("");
  const [keyword, setKeyword] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productCategoriesService.getAll().then((cats) => {
      setCategories(cats.map((c) => ({
        ...c,
        updatedAt: c.updatedAt ? formatThaiDate(new Date(c.updatedAt)) : formatThaiDate(),
      })));
    }).catch(() => setCategories([])).finally(() => setLoading(false));
  }, []);

  const filteredRows = useMemo(() => {
    let result = categories;
    if (activeTab !== "ทั้งหมด") {
      result = result.filter((item) => item.kind === activeTab);
    }
    const q = keyword.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.kind.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeTab, categories, keyword]);

  const totalDoor = categories.filter((item) => item.kind === "ประตูม้วน").length;
  const totalParts = categories.filter((item) => item.kind === "อะไหล่").length;

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setKind("ประตูม้วน");
    setIsActive(true);
    setSelectedColors([]);
    setCustomColor("");
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const addCustomColor = () => {
    const color = customColor.trim();
    if (!color) return;
    if (selectedColors.includes(color)) {
      setCustomColor("");
      return;
    }
    setSelectedColors((prev) => [...prev, color]);
    setCustomColor("");
  };

  const toggleCategoryStatus = async (id: string) => {
    const target = categories.find((item) => item.id === id);
    if (!target) return;
    const updated = await productCategoriesService.update(id, {
      isActive: !target.isActive,
    });
    const formatted = { ...updated, updatedAt: formatThaiDate(new Date(updated.updatedAt)) };
    setCategories((prev) => prev.map((item) => (item.id === id ? formatted : item)));
    setToast(formatted.isActive ? "เปิดใช้งานสำเร็จ" : "ปิดใช้งานสำเร็จ");
  };

  const requestDeleteCategory = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDeleteCategory = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await productCategoriesService.remove(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      setToast("ลบประเภทสินค้าสำเร็จ");
    } catch {
      setAlertMsg("ไม่สามารถลบได้ อาจมีสินค้าอยู่ในประเภทนี้");
    }
  };

  const editCategory = (id: string) => {
    const target = categories.find((item) => item.id === id);
    if (!target) return;

    setEditingId(id);
    setName(target.name);
    setKind(target.kind);
    setIsActive(target.isActive);
    setSelectedColors(target.kind === "ประตูม้วน" ? target.colors : []);
    setCustomColor("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    if (kind === "ประตูม้วน" && selectedColors.length === 0) return;

    if (editingId) {
      const updated = await productCategoriesService.update(editingId, {
        name: trimmedName,
        kind,
        colors: kind === "ประตูม้วน" ? selectedColors : [],
        isActive,
      });
      const formatted = { ...updated, updatedAt: formatThaiDate(new Date(updated.updatedAt)) };
      setCategories((prev) => prev.map((item) => (item.id === editingId ? formatted : item)));
      closeModal();
      setToast("แก้ไขประเภทสินค้าสำเร็จ");
      return;
    }

    const created = await productCategoriesService.create({
      name: trimmedName,
      kind,
      colors: kind === "ประตูม้วน" ? selectedColors : [],
      isActive,
    });
    const formatted = { ...created, updatedAt: formatThaiDate(new Date(created.updatedAt)) };
    setCategories((prev) => [formatted, ...prev]);
    closeModal();
    setToast("เพิ่มประเภทสินค้าสำเร็จ");
  };

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">จัดการประเภทสินค้า</h1>
          <p className="mt-1 text-sm text-blue-200/80">
            จัดการประเภทประตูม้วนและอะไหล่ เพื่อใช้งานต่อในหน้าจัดการออเดอร์
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            {([
              { label: "ประเภททั้งหมด", value: categories.length, icon: TagIcon, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", accent: "bg-blue-600" },
              { label: "ประเภทประตูม้วน", value: totalDoor, icon: WrenchScrewdriverIcon, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", accent: "bg-indigo-500" },
              { label: "ประเภทอะไหล่", value: totalParts, icon: Cog6ToothIcon, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", accent: "bg-emerald-500" },
            ] as const).map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`absolute left-0 top-0 h-full w-1 ${card.accent}`} />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{card.label}</p>
                      <p className={`mt-1.5 text-3xl font-bold tracking-tight ${card.color}`}>
                        {card.value.toLocaleString("th-TH")}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">รายการ</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.border} border`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section>
            <ProductCategoriesTable
              rows={filteredRows}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onToggleStatus={toggleCategoryStatus}
              onAddNew={openCreateModal}
              onEdit={editCategory}
              onDelete={requestDeleteCategory}
              keyword={keyword}
              onKeywordChange={setKeyword}
            />
          </section>
        </>
      )}

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
      <AlertModal open={!!alertMsg} message={alertMsg ?? ""} onClose={() => setAlertMsg(null)} />
      <ConfirmModal
        open={!!pendingDeleteId}
        message="ต้องการลบประเภทสินค้านี้หรือไม่?"
        confirmText="ลบ"
        onConfirm={confirmDeleteCategory}
        onCancel={() => setPendingDeleteId(null)}
      />

      <ProductCategoryForm
        open={modalOpen}
        editing={Boolean(editingId)}
        name={name}
        kind={kind}
        isActive={isActive}
        selectedColors={selectedColors}
        customColor={customColor}
        defaultColors={defaultColors}
        onClose={closeModal}
        onNameChange={setName}
        onKindChange={(nextKind) => {
          setKind(nextKind);
          if (nextKind === "อะไหล่") {
            setSelectedColors([]);
          }
        }}
        onStatusChange={setIsActive}
        onToggleColor={toggleColor}
        onCustomColorChange={setCustomColor}
        onAddCustomColor={addCustomColor}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
