"use client";

import { useMemo, useState } from "react";
import { defaultColors, initialCategories } from "./component/mock-data";
import { ProductCategoriesTable } from "./component/product-categories-table";
import { ProductCategoryForm } from "./component/product-category-form";
import type { CategoryKind, ProductCategory } from "./component/types";

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"ทั้งหมด" | CategoryKind>("ทั้งหมด");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<CategoryKind>("ประตูม้วน");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("");

  const filteredRows = useMemo(() => {
    if (activeTab === "ทั้งหมด") return categories;
    return categories.filter((item) => item.kind === activeTab);
  }, [activeTab, categories]);

  const totalDoor = categories.filter((item) => item.kind === "ประตูม้วน").length;
  const totalParts = categories.filter((item) => item.kind === "อะไหล่").length;

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
              updatedAt: new Date().toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }
          : item,
      ),
    );
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

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <ProductCategoriesTable
          rows={filteredRows}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleStatus={toggleCategoryStatus}
        />
        <ProductCategoryForm
          name={name}
          kind={kind}
          selectedColors={selectedColors}
          customColor={customColor}
          defaultColors={defaultColors}
          onNameChange={setName}
          onKindChange={setKind}
          onToggleColor={toggleColor}
          onCustomColorChange={setCustomColor}
          onAddCustomColor={addCustomColor}
        />
      </section>
    </div>
  );
}
