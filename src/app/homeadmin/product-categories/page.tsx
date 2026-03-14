"use client";

import { useMemo, useState } from "react";
import { defaultColors, initialCategories } from "./component/mock-data";
import { ProductCategoriesTable } from "./component/product-categories-table";
import { ProductCategoryForm } from "./component/product-category-form";
import type { CategoryKind, ProductCategory } from "./component/types";

function formatThaiDate(date = new Date()) {
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"ทั้งหมด" | CategoryKind>("ทั้งหมด");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [kind, setKind] = useState<CategoryKind>("ประตูม้วน");
  const [isActive, setIsActive] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("");

  const filteredRows = useMemo(() => {
    if (activeTab === "ทั้งหมด") return categories;
    return categories.filter((item) => item.kind === activeTab);
  }, [activeTab, categories]);

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

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isActive: !item.isActive,
              updatedAt: formatThaiDate(),
            }
          : item,
      ),
    );
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

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    if (kind === "ประตูม้วน" && selectedColors.length === 0) return;

    if (editingId) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: trimmedName,
                kind,
                colors: kind === "ประตูม้วน" ? selectedColors : [],
                isActive,
                updatedAt: formatThaiDate(),
              }
            : item,
        ),
      );
      closeModal();
      return;
    }

    setCategories((prev) => [
      {
        id: `CAT-${String(prev.length + 1).padStart(3, "0")}`,
        name: trimmedName,
        kind,
        colors: kind === "ประตูม้วน" ? selectedColors : [],
        isActive,
        updatedAt: formatThaiDate(),
      },
      ...prev,
    ]);
    closeModal();
  };

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-linear-to-r from-blue-900 to-blue-700 px-5 py-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">จัดการประเภทสินค้า</h1>
        <p className="mt-1 text-sm text-blue-100">
          จัดการประเภทประตูม้วนและอะไหล่ เพื่อใช้งานต่อในหน้าจัดการออเดอร์
        </p>
      </header>

      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">ประเภททั้งหมด</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{categories.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">ประเภทประตูม้วน</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalDoor}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">ประเภทอะไหล่</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalParts}</p>
        </div>
      </section>

      <section className="mt-4">
        <ProductCategoriesTable
          rows={filteredRows}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleStatus={toggleCategoryStatus}
          onAddNew={openCreateModal}
          onEdit={editCategory}
        />
      </section>

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
