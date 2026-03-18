"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { productCategoriesService } from "@/lib/services/product-categories.service";
import { productsService } from "@/lib/services/products.service";
import type { CategoryKind, ProductCategory } from "../product-categories/component/types";
import { ProductFormModal } from "./component/product-form";
import { ProductStats } from "./component/product-stats";
import { ProductsTable } from "./component/products-table";
import { AlertModal } from "@/components/alert-modal";
import { SuccessToast } from "@/components/success-toast";
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
    unit: "ชิ้น",
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
  const [keyword, setKeyword] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data.map((p) => ({
        ...p,
        updatedAt: p.updatedAt ? formatThaiDate(new Date(p.updatedAt)) : formatThaiDate(),
      })));
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      productCategoriesService
        .getAll()
        .then((data) => {
          const active = data.filter((item) => item.isActive);
          setAllActiveCategories(active);
          const firstDoorCategory = active.find((item) => item.kind === "ประตูม้วน");
          setForm((prev) => ({ ...prev, categoryId: firstDoorCategory?.id ?? "" }));
        })
        .catch(() => setAllActiveCategories([])),
      fetchProducts(),
    ]).finally(() => setLoading(false));
  }, [fetchProducts]);

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
    let result = products;
    if (activeTab === "ประตูม้วน") {
      result = result.filter((item) => item.kind === "ประตูม้วน");
    } else if (activeTab !== "ทั้งหมด") {
      result = result.filter((item) => item.kind === "อะไหล่");
    }
    const q = keyword.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeTab, products, keyword]);

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
    });
    await fetchProducts();
    setToast(updated.status === "วางขาย" ? "เปิดวางขายสำเร็จ" : "ยกเลิกการขายสำเร็จ");
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
      unit: (target as ProductItem & { unit?: string }).unit || "ชิ้น",
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

    if (!name) { setAlertMsg("กรุณากรอกชื่อสินค้า"); return; }
    if (!category) { setAlertMsg("กรุณาเลือกหมวดหมู่สินค้า"); return; }
    if (isDoor && form.colors.length === 0) { setAlertMsg("กรุณาเลือกสีอย่างน้อย 1 สี"); return; }
    if (!isDoor && (!Number.isFinite(price) || price <= 0)) { setAlertMsg("กรุณากรอกราคาสินค้า"); return; }

    const payload = {
      name,
      kind: form.productType,
      categoryId: category.id,
      categoryName: category.name,
      price: isDoor ? null : price,
      unit: isDoor ? "" : form.unit.trim() || "ชิ้น",
      colors: isDoor ? form.colors : [],
      description: form.description.trim(),
      warrantyYears: form.warrantyYears.trim(),
      images: form.images,
      status: form.isSelling ? "วางขาย" as const : "ยกเลิกการขาย" as const,
    };

    try {
      if (editingId) {
        await productsService.update(editingId, payload);
        await fetchProducts();
        closeModal();
        setToast("แก้ไขสินค้าสำเร็จ");
        return;
      }

      await productsService.create(payload);
      await fetchProducts();
      closeModal();
      setToast("เพิ่มสินค้าสำเร็จ");
    } catch (err) {
      setAlertMsg("เกิดข้อผิดพลาด: " + (err instanceof Error ? err.message : "ไม่สามารถบันทึกได้"));
    }
  };

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
          <p className="mt-1 text-sm text-blue-200/80">
            เพิ่ม/แก้ไขสินค้าผ่าน modal และจัดการสถานะวางขายได้ทันที
          </p>
        </div>
      </header>

      <ProductStats total={products.length} selling={sellingCount} />

      <section>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
          </div>
        ) : (
          <ProductsTable
            rows={filteredProducts}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onToggleStatus={toggleProductStatus}
            onEdit={editProduct}
            onAddNew={openCreateModal}
            toCurrency={toCurrency}
            keyword={keyword}
            onKeywordChange={setKeyword}
          />
        )}
      </section>

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
      <AlertModal open={!!alertMsg} message={alertMsg ?? ""} onClose={() => setAlertMsg(null)} variant="warning" />

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
