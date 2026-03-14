"use client";

import { useMemo, useState } from "react";
import { initialCategories } from "../product-categories/component/mock-data";
import { emptyProductForm, initialProducts } from "./component/mock-data";
import { ProductForm } from "./component/product-form";
import { ProductStats } from "./component/product-stats";
import { ProductsTable } from "./component/products-table";
import type { ProductFormState, ProductItem, ProductTab } from "./component/types";

function formatThaiDate(date = new Date()) {
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toCurrency(value: number) {
  return new Intl.NumberFormat("th-TH").format(value);
}

export default function ProductsPage() {
  const categoryOptions = useMemo(
    () => initialCategories.filter((item) => item.isActive),
    [],
  );

  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<ProductTab>("ทั้งหมด");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(() => ({
    ...emptyProductForm,
    categoryId: categoryOptions[0]?.id ?? "",
  }));

  const selectedCategory = useMemo(
    () => categoryOptions.find((item) => item.id === form.categoryId),
    [categoryOptions, form.categoryId],
  );

  const availableColors = selectedCategory?.kind === "ประตูม้วน" ? selectedCategory.colors : [];

  const filteredProducts = useMemo(() => {
    if (activeTab === "ทั้งหมด") return products;
    if (activeTab === "ประตูม้วน") {
      return products.filter((item) => item.kind === "ประตูม้วน");
    }
    return products.filter((item) => item.kind === "อะไหล่");
  }, [activeTab, products]);

  const sellingCount = products.filter((item) => item.status === "วางขาย").length;

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...emptyProductForm,
      categoryId: categoryOptions[0]?.id ?? "",
    });
  };

  const handlePickImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const nextUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...nextUrls] }));
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "วางขาย" ? "ยกเลิกการขาย" : "วางขาย",
              updatedAt: formatThaiDate(),
            }
          : item,
      ),
    );
  };

  const editProduct = (id: string) => {
    const target = products.find((item) => item.id === id);
    if (!target) return;

    setEditingId(id);
    setForm({
      name: target.name,
      categoryId: target.categoryId,
      price: String(target.price),
      color: target.color === "-" ? "" : target.color,
      images: target.images,
    });
  };

  const submitForm = () => {
    const name = form.name.trim();
    const price = Number(form.price);
    const category = categoryOptions.find((item) => item.id === form.categoryId);

    if (!name || !category || !Number.isFinite(price) || price <= 0) {
      return;
    }

    const isDoor = category.kind === "ประตูม้วน";
    const color = isDoor ? form.color.trim() : "-";

    if (isDoor && !color) {
      return;
    }

    if (editingId) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name,
                categoryId: category.id,
                categoryName: category.name,
                kind: category.kind,
                price,
                color,
                images: form.images,
                updatedAt: formatThaiDate(),
              }
            : item,
        ),
      );
      resetForm();
      return;
    }

    setProducts((prev) => [
      {
        id: `PD-${String(prev.length + 1).padStart(3, "0")}`,
        name,
        kind: category.kind,
        categoryId: category.id,
        categoryName: category.name,
        price,
        color,
        images: form.images,
        status: "วางขาย",
        updatedAt: formatThaiDate(),
      },
      ...prev,
    ]);

    resetForm();
  };

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-linear-to-r from-blue-900 to-blue-700 px-5 py-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
        <p className="mt-1 text-sm text-blue-100">
          เพิ่ม/แก้ไขสินค้าประตูม้วนและอะไหล่ พร้อมจัดการสถานะวางขายได้ทันที
        </p>
      </header>

      <ProductStats total={products.length} selling={sellingCount} />

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ProductsTable
          rows={filteredProducts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleStatus={toggleProductStatus}
          onEdit={editProduct}
          toCurrency={toCurrency}
        />

        <ProductForm
          editing={Boolean(editingId)}
          form={form}
          categoryOptions={categoryOptions}
          availableColors={availableColors}
          onReset={resetForm}
          onPickImages={handlePickImages}
          onRemoveImage={handleRemoveImage}
          onFormChange={setForm}
          onSubmit={submitForm}
        />
      </section>
    </div>
  );
}
