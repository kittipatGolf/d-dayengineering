"use client";

import { useEffect, useMemo, useState } from "react";
import { productCategoriesService } from "@/lib/services/product-categories.service";
import { productsService } from "@/lib/services/products.service";
import type { CategoryKind, ProductCategory } from "../product-categories/component/types";
import { ProductFormModal } from "./component/product-form";
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

function emptyProductForm(type: CategoryKind, categoryId: string): ProductFormState {
  return {
    productType: type,
    name: "",
    categoryId,
    price: "",
    colors: [],
    description: "",
    warrantyYears: "",
    isSelling: true,
    images: [],
  };
}

export default function ProductsPage() {
  const [allActiveCategories, setAllActiveCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeTab, setActiveTab] = useState<ProductTab>("ทั้งหมด");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(() =>
    emptyProductForm("ประตูม้วน", ""),
  );

  useEffect(() => {
    productCategoriesService
      .getAll()
      .then((data) => {
        const active = data.filter((item) => item.isActive);
        setAllActiveCategories(active);
        const firstDoorCategory = active.find((item) => item.kind === "ประตูม้วน");
        setForm((prev) => ({ ...prev, categoryId: firstDoorCategory?.id ?? "" }));
      })
      .catch(() => setAllActiveCategories([]));

    productsService.getAll().then(setProducts).catch(() => setProducts([]));
  }, []);

  const categoryOptions = useMemo(
    () => allActiveCategories.filter((item) => item.kind === form.productType),
    [allActiveCategories, form.productType],
  );

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

  const resetForm = (type: CategoryKind = "ประตูม้วน") => {
    const firstCategory = allActiveCategories.find((item) => item.kind === type);
    setEditingId(null);
    setForm(emptyProductForm(type, firstCategory?.id ?? ""));
  };

  const openCreateModal = () => {
    resetForm("ประตูม้วน");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleProductTypeChange = (nextType: CategoryKind) => {
    const nextCategories = allActiveCategories.filter((item) => item.kind === nextType);
    setForm((prev) => ({
      ...prev,
      productType: nextType,
      categoryId: nextCategories[0]?.id ?? "",
      colors: [],
      price: nextType === "ประตูม้วน" ? "" : prev.price,
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const nextCategory = allActiveCategories.find((item) => item.id === categoryId);
    setForm((prev) => ({
      ...prev,
      categoryId,
      colors:
        nextCategory?.kind === "ประตูม้วน"
          ? prev.colors.filter((color) => nextCategory.colors.includes(color))
          : [],
    }));
  };

  const toggleProductStatus = async (id: string) => {
    const target = products.find((item) => item.id === id);
    if (!target) return;
    const updated = await productsService.update(id, {
      status: target.status === "วางขาย" ? "ยกเลิกการขาย" : "วางขาย",
      updatedAt: formatThaiDate(),
    });
    setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const editProduct = (id: string) => {
    const target = products.find((item) => item.id === id);
    if (!target) return;

    setEditingId(id);
    setForm({
      productType: target.kind,
      name: target.name,
      categoryId: target.categoryId,
      price: target.price ? String(target.price) : "",
      colors: target.colors,
      description: target.description,
      warrantyYears: target.warrantyYears,
      isSelling: target.status === "วางขาย",
      images: target.images,
    });
    setModalOpen(true);
  };

  const submitForm = async () => {
    const name = form.name.trim();
    const category = allActiveCategories.find((item) => item.id === form.categoryId);
    const isDoor = form.productType === "ประตูม้วน";
    const price = Number(form.price);

    if (!name || !category || category.kind !== form.productType) return;
    if (isDoor && form.colors.length === 0) return;
    if (!isDoor && (!Number.isFinite(price) || price <= 0)) return;

    const payload = {
      name,
      kind: form.productType,
      categoryId: category.id,
      categoryName: category.name,
      price: isDoor ? null : price,
      colors: isDoor ? form.colors : [],
      description: form.description.trim(),
      warrantyYears: form.warrantyYears.trim(),
      images: form.images,
      status: form.isSelling ? "วางขาย" : "ยกเลิกการขาย",
      updatedAt: formatThaiDate(),
    } as const;

    if (editingId) {
      const updated = await productsService.update(editingId, payload);
      setProducts((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      closeModal();
      return;
    }

    const created = await productsService.create(payload);
    setProducts((prev) => [created, ...prev]);
    closeModal();
  };

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-linear-to-r from-blue-900 to-blue-700 px-5 py-5 text-white shadow-sm">
        <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
        <p className="mt-1 text-sm text-blue-100">
          เพิ่ม/แก้ไขสินค้าผ่าน modal และจัดการสถานะวางขายได้ทันที
        </p>
      </header>

      <ProductStats total={products.length} selling={sellingCount} />

      <section className="mt-4">
        <ProductsTable
          rows={filteredProducts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleStatus={toggleProductStatus}
          onEdit={editProduct}
          onAddNew={openCreateModal}
          toCurrency={toCurrency}
        />
      </section>

      <ProductFormModal
        open={modalOpen}
        editing={Boolean(editingId)}
        form={form}
        categoryOptions={categoryOptions}
        availableColors={availableColors}
        onClose={closeModal}
        onProductTypeChange={handleProductTypeChange}
        onCategoryChange={handleCategoryChange}
        onFormChange={setForm}
        onSubmit={submitForm}
      />
    </div>
  );
}
