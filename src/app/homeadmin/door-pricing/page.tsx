"use client";

import { useEffect, useMemo, useState } from "react";
import { doorPricingService } from "@/lib/services/door-pricing.service";
import { productCategoriesService } from "@/lib/services/product-categories.service";
import type { ProductCategory } from "../product-categories/component/types";
import { DoorPricingFormModal } from "./component/door-pricing-form-modal";
import { DoorPricingTable } from "./component/door-pricing-table";
import { SuccessToast } from "@/components/success-toast";
import type { DoorPricingFormState, DoorPricingRow } from "./component/types";

function formatThaiDate(date = new Date()) {
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function emptyDoorPricingForm(categoryId: string): DoorPricingFormState {
  return {
    categoryId,
    mode: "existing",
    selectedThickness: "",
    newThickness: "",
    minArea: "1",
    maxArea: "",
    pricePerSqm: "",
  };
}

export default function DoorPricingPage() {
  const [doorCategories, setDoorCategories] = useState<ProductCategory[]>([]);
  const [rows, setRows] = useState<DoorPricingRow[]>([]);
  const [filterValue, setFilterValue] = useState("ทั้งหมด");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DoorPricingFormState>(emptyDoorPricingForm(""));
  const [keyword, setKeyword] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    productCategoriesService
      .getAll()
      .then((all) => {
        const doors = all.filter((item) => item.kind === "ประตูม้วน" && item.isActive);
        setDoorCategories(doors);
        setForm((prev) => ({ ...prev, categoryId: doors[0]?.id ?? "" }));
      })
      .catch(() => setDoorCategories([]));

    doorPricingService.getAll().then((data) => {
      setRows(data.map((r) => ({
        ...r,
        updatedAt: r.updatedAt ? formatThaiDate(new Date(r.updatedAt)) : formatThaiDate(),
      })));
    }).catch(() => setRows([]));
  }, []);

  const filterOptions = useMemo(
    () => ["ทั้งหมด", ...doorCategories.map((item) => item.name)],
    [doorCategories],
  );

  const filteredRows = useMemo(() => {
    let result = rows;
    if (filterValue !== "ทั้งหมด") {
      result = result.filter((row) => row.categoryName === filterValue);
    }
    const q = keyword.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (row) =>
          row.categoryName.toLowerCase().includes(q) ||
          row.thickness.toLowerCase().includes(q) ||
          String(row.pricePerSqm).includes(q),
      );
    }
    return result;
  }, [filterValue, rows, keyword]);

  const existingThicknesses = useMemo(() => {
    const list = rows
      .filter((row) => row.categoryId === form.categoryId)
      .map((row) => row.thickness);
    return Array.from(new Set(list));
  }, [rows, form.categoryId]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyDoorPricingForm(doorCategories[0]?.id ?? ""));
    setOpen(true);
  };

  const openEdit = (id: string) => {
    const target = rows.find((row) => row.id === id);
    if (!target) return;

    setEditingId(id);
    setForm({
      categoryId: target.categoryId,
      mode: "existing",
      selectedThickness: target.thickness,
      newThickness: "",
      minArea: String(target.minArea),
      maxArea: String(target.maxArea),
      pricePerSqm: String(target.pricePerSqm),
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
  };

  const onDelete = async (id: string) => {
    await doorPricingService.remove(id);
    setRows((prev) => prev.filter((row) => row.id !== id));
    setToast("ลบราคาสำเร็จ");
  };

  const onSubmit = async () => {
    const category = doorCategories.find((item) => item.id === form.categoryId);
    const thickness = form.mode === "new" ? form.newThickness.trim() : form.selectedThickness.trim();
    const minArea = Number(form.minArea);
    const maxArea = Number(form.maxArea);
    const pricePerSqm = Number(form.pricePerSqm);

    if (!category || !thickness) return;
    if (!Number.isFinite(minArea) || !Number.isFinite(maxArea) || minArea <= 0 || maxArea < minArea) return;
    if (!Number.isFinite(pricePerSqm) || pricePerSqm <= 0) return;

    const payload = {
      categoryId: category.id,
      categoryName: category.name,
      thickness,
      minArea,
      maxArea,
      pricePerSqm,
    };

    if (editingId) {
      const updated = await doorPricingService.update(editingId, payload);
      const formatted = { ...updated, updatedAt: formatThaiDate(new Date(updated.updatedAt)) };
      setRows((prev) => prev.map((row) => (row.id === editingId ? formatted : row)));
      closeModal();
      setToast("แก้ไขราคาสำเร็จ");
      return;
    }

    const created = await doorPricingService.create(payload);
    const formatted = { ...created, updatedAt: formatThaiDate(new Date(created.updatedAt)) };
    setRows((prev) => [formatted, ...prev]);
    closeModal();
    setToast("เพิ่มราคาสำเร็จ");
  };

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">จัดการราคาประตูม้วน</h1>
          <p className="mt-1 text-sm text-blue-200/80">
            เลือกประเภทจากหน้าจัดการประเภทสินค้า แล้วกำหนดความหนาและช่วงราคาใน flow เดียว
          </p>
        </div>
      </header>

      <section>
        <DoorPricingTable
          rows={filteredRows}
          filterValue={filterValue}
          filterOptions={filterOptions}
          onFilterChange={setFilterValue}
          onAdd={openCreate}
          onEdit={openEdit}
          onDelete={onDelete}
          keyword={keyword}
          onKeywordChange={setKeyword}
        />
      </section>

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      <DoorPricingFormModal
        open={open}
        editing={Boolean(editingId)}
        form={form}
        doorCategories={doorCategories}
        existingThicknesses={existingThicknesses}
        onClose={closeModal}
        onFormChange={setForm}
        onSubmit={onSubmit}
      />
    </div>
  );
}
