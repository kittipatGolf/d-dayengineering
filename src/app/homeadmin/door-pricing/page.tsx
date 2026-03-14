"use client";

import { useEffect, useMemo, useState } from "react";
import { doorPricingService } from "@/lib/services/door-pricing.service";
import { productCategoriesService } from "@/lib/services/product-categories.service";
import type { ProductCategory } from "../product-categories/component/types";
import { DoorPricingFormModal } from "./component/door-pricing-form-modal";
import { DoorPricingTable } from "./component/door-pricing-table";
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

  useEffect(() => {
    productCategoriesService
      .getAll()
      .then((all) => {
        const doors = all.filter((item) => item.kind === "ประตูม้วน" && item.isActive);
        setDoorCategories(doors);
        setForm((prev) => ({ ...prev, categoryId: doors[0]?.id ?? "" }));
      })
      .catch(() => setDoorCategories([]));

    doorPricingService.getAll().then(setRows).catch(() => setRows([]));
  }, []);

  const filterOptions = useMemo(
    () => ["ทั้งหมด", ...doorCategories.map((item) => item.name)],
    [doorCategories],
  );

  const filteredRows = useMemo(() => {
    if (filterValue === "ทั้งหมด") return rows;
    return rows.filter((row) => row.categoryName === filterValue);
  }, [filterValue, rows]);

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
      updatedAt: formatThaiDate(),
    };

    if (editingId) {
      const updated = await doorPricingService.update(editingId, payload);
      setRows((prev) => prev.map((row) => (row.id === editingId ? updated : row)));
      closeModal();
      return;
    }

    const created = await doorPricingService.create(payload);
    setRows((prev) => [created, ...prev]);
    closeModal();
  };

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-linear-to-r from-blue-900 to-blue-700 px-5 py-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">จัดการราคาประตูม้วน</h1>
        <p className="mt-1 text-sm text-blue-100">
          เลือกประเภทจากหน้าจัดการประเภทสินค้า แล้วกำหนดความหนาและช่วงราคาใน flow เดียว
        </p>
      </header>

      <section className="mt-4">
        <DoorPricingTable
          rows={filteredRows}
          filterValue={filterValue}
          filterOptions={filterOptions}
          onFilterChange={setFilterValue}
          onAdd={openCreate}
          onEdit={openEdit}
          onDelete={onDelete}
        />
      </section>

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
