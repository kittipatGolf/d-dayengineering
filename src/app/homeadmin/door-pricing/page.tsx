"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { doorPricingService } from "@/lib/services/door-pricing.service";
import { productCategoriesService } from "@/lib/services/product-categories.service";
import type { ProductCategory } from "../product-categories/component/types";
import { DoorPricingFormModal } from "./component/door-pricing-form-modal";
import { DoorPricingTable } from "./component/door-pricing-table";
import { SuccessToast } from "@/components/success-toast";
import { ConfirmModal } from "@/components/confirm-modal";
import type { DoorPricingFormState, DoorPricingRow } from "./component/types";

function formatThaiDate(date = new Date()) {
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function emptyDoorPricingForm(categoryId: string, mode: "existing" | "new" = "new"): DoorPricingFormState {
  return {
    categoryId,
    mode,
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
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    try {
      const data = await doorPricingService.getAll();
      setRows(data.map((r) => ({
        ...r,
        updatedAt: r.updatedAt ? formatThaiDate(new Date(r.updatedAt)) : formatThaiDate(),
      })));
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      productCategoriesService
        .getAll()
        .then((all) => {
          const doors = all.filter((item) => item.kind === "ประตูม้วน" && item.isActive);
          setDoorCategories(doors);
          setForm((prev) => ({ ...prev, categoryId: doors[0]?.id ?? "" }));
        })
        .catch(() => setDoorCategories([])),
      fetchRows(),
    ]).finally(() => setLoading(false));
  }, [fetchRows]);

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

  // Auto-switch to "new" mode when no existing thicknesses for selected category
  useEffect(() => {
    if (existingThicknesses.length === 0 && form.mode === "existing") {
      setForm((prev) => ({ ...prev, mode: "new", selectedThickness: "" }));
    }
  }, [existingThicknesses.length, form.mode]);

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

  const confirmDelete = async () => {
    if (!deleteId) return;
    await doorPricingService.remove(deleteId);
    setDeleteId(null);
    await fetchRows();
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
      await doorPricingService.update(editingId, payload);
      await fetchRows();
      closeModal();
      setToast("แก้ไขราคาสำเร็จ");
      return;
    }

    await doorPricingService.create(payload);
    await fetchRows();
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
          </div>
        ) : (
          <DoorPricingTable
            rows={filteredRows}
            filterValue={filterValue}
            filterOptions={filterOptions}
            onFilterChange={setFilterValue}
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={setDeleteId}
            keyword={keyword}
            onKeywordChange={setKeyword}
          />
        )}
      </section>

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
      <ConfirmModal
        open={!!deleteId}
        message="คุณต้องการลบช่วงราคานี้ใช่หรือไม่?"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        confirmText="ลบ"
        variant="danger"
      />

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
