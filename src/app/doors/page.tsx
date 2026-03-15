"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryFilterPanel } from "@/components/category-filter-panel";
import { SearchBar } from "@/components/search-bar";
import { SearchableSelect } from "@/components/searchable-select";
import { useCart } from "@/lib/cart-context";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";

type DoorPricingRow = {
  id: string;
  categoryId: string;
  categoryName: string;
  thickness: string;
  minArea: number;
  maxArea: number;
  pricePerSqm: number;
};

type ProductCategory = {
  id: string;
  name: string;
  kind: string;
  colors: string[];
  isActive: boolean;
};

type ProductItem = {
  id: string;
  name: string;
  kind: string;
  categoryName: string;
  description: string;
  images: string[];
  colors: string[];
  status: string;
};

const defaultColors = ["เงิน", "ขาว", "ครีม", "น้ำเงิน", "เทา"];

export default function DoorsPage() {
  const { addItem } = useCart();

  const [pricingRows, setPricingRows] = useState<DoorPricingRow[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/door-pricing").then((r) => r.json()).then(setPricingRows).catch(() => {}),
      fetch("/api/product-categories").then((r) => r.json()).then(setProductCategories).catch(() => {}),
      fetch("/api/products")
        .then((r) => r.json())
        .then((data: ProductItem[]) => setProducts(data.filter((p) => p.kind === "ประตูม้วน" && p.status === "วางขาย")))
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const doorCategories = useMemo(
    () => productCategories.filter((c) => c.kind === "ประตูม้วน" && c.isActive),
    [productCategories],
  );

  const categoryNames = useMemo(
    () => ["ทั้งหมด", ...doorCategories.map((c) => c.name)],
    [doorCategories],
  );

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== "ทั้งหมด") {
      result = result.filter((p) => p.categoryName === activeCategory);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [products, activeCategory, query]);

  /* modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoorType, setSelectedDoorType] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [thickness, setThickness] = useState("");
  const [color, setColor] = useState("");
  const [installOption, setInstallOption] = useState("ติดตั้ง");
  const [toast, setToast] = useState(false);
  const [detailProduct, setDetailProduct] = useState<ProductItem | null>(null);

  const matchingCategory = doorCategories.find((c) => c.name === selectedDoorType);
  const thicknessOptions = [
    ...new Set(
      pricingRows.filter((r) => r.categoryName === selectedDoorType).map((r) => r.thickness),
    ),
  ];
  const colorOptions =
    matchingCategory && matchingCategory.colors.length > 0
      ? matchingCategory.colors
      : defaultColors;

  const area = parseFloat(width) * parseFloat(length) || 0;
  const matchedPricing = pricingRows.find(
    (r) =>
      r.categoryName === selectedDoorType &&
      r.thickness === thickness &&
      area >= r.minArea &&
      area <= r.maxArea,
  );
  const calculatedPrice = matchedPricing ? area * matchedPricing.pricePerSqm : 0;

  const openModal = (categoryName: string) => {
    const match = doorCategories.find((c) => categoryName.includes(c.name) || c.name.includes(categoryName));
    setSelectedDoorType(match ? match.name : doorCategories[0]?.name ?? categoryName);
    setWidth("");
    setLength("");
    setThickness("");
    setColor("");
    setInstallOption("ติดตั้ง");
    setModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedDoorType || !width || !length || !thickness || !color) return;
    addItem({
      type: "door",
      name: selectedDoorType,
      categoryName: matchingCategory?.name ?? selectedDoorType,
      images: [],
      color,
      widthM: parseFloat(width),
      lengthM: parseFloat(length),
      thickness,
      installOption,
      quantity: 1,
      pricePerUnit: calculatedPrice,
      warranty: "1 ปี",
    });
    setModalOpen(false);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-center text-2xl sm:text-4xl font-bold text-slate-900">ประตูม้วน</h1>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-4">
          <SearchBar className="max-w-none" value={query} onChange={setQuery} />
          <CategoryFilterPanel
            title="ชนิดของประตูม้วน"
            items={categoryNames}
            activeItem={activeCategory}
            onSelect={setActiveCategory}
          />
        </aside>

        {loading ? (
          <div className="flex items-center justify-center py-20" role="status">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <span className="sr-only">กำลังโหลด...</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-12">ยังไม่มีสินค้าประตูม้วน</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => setDetailProduct(product)}
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-zinc-500 via-zinc-700 to-zinc-900">
                      <span className="text-4xl text-white/60">🚪</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
                    <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
                      ดูรายละเอียด
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-bold text-slate-900">{product.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-slate-500 line-clamp-2">{product.description}</p>
                  <p className="mt-2 text-sm font-semibold text-blue-700">ราคาขึ้นอยู่กับขนาด</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openModal(product.categoryName); }}
                  className="flex items-center justify-center gap-2 rounded-b-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 active:scale-95"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  สั่งซื้อประตูม้วน
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Detail Modal ---------- */}
      {detailProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`รายละเอียด ${detailProduct.name}`}
          onKeyDown={(e) => { if (e.key === "Escape") setDetailProduct(null); }}
          onClick={() => setDetailProduct(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="ปิด"
              onClick={() => setDetailProduct(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1 text-slate-400 hover:text-slate-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {detailProduct.images.length > 0 ? (
              <div className="flex gap-1 overflow-x-auto">
                {detailProduct.images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`${detailProduct.name} ${i + 1}`}
                    className="h-56 min-w-[50%] flex-1 object-cover first:rounded-tl-2xl last:rounded-tr-2xl"
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center rounded-t-2xl bg-linear-to-br from-zinc-500 via-zinc-700 to-zinc-900">
                <span className="text-5xl text-white/60">🚪</span>
              </div>
            )}

            <div className="space-y-3 p-5">
              <h2 className="text-xl font-bold text-slate-900">{detailProduct.name}</h2>
              <p className="text-sm text-slate-500">ประเภท: {detailProduct.categoryName}</p>

              {detailProduct.description && (
                <p className="text-sm leading-relaxed text-slate-700">{detailProduct.description}</p>
              )}

              <p className="text-sm font-semibold text-blue-700">ราคาขึ้นอยู่กับขนาดและความหนา</p>

              <button
                type="button"
                onClick={() => { setDetailProduct(null); openModal(detailProduct.categoryName); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-blue-700 active:scale-95"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                สั่งซื้อประตูม้วน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Order Modal ---------- */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => { if (e.key === "Escape") setModalOpen(false); }}
          onClick={() => setModalOpen(false)}
        >
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="ปิด" onClick={() => setModalOpen(false)} className="absolute right-4 top-4 rounded-xl p-1 text-slate-400 hover:text-slate-700">
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="mb-5 text-xl font-bold text-slate-900">สั่งซื้อประตูม้วน</h2>

            <div className="space-y-4">
              <SearchableSelect
                id="door-type"
                label="ประเภทประตู"
                placeholder="เลือกประเภทประตู"
                options={doorCategories.map((c) => ({ value: c.name, label: c.name }))}
                value={selectedDoorType}
                onChange={(v) => { setSelectedDoorType(v); setThickness(""); setColor(""); }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">ความกว้าง (เมตร)</label>
                  <input type="number" min="0" step="0.01" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="เช่น 3.5" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">ความยาว (เมตร)</label>
                  <input type="number" min="0" step="0.01" value={length} onChange={(e) => setLength(e.target.value)} placeholder="เช่น 4.0" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>

              <SearchableSelect
                id="door-thickness"
                label="ความหนา"
                placeholder="-- เลือกความหนา --"
                options={thicknessOptions}
                value={thickness}
                onChange={setThickness}
              />

              <SearchableSelect
                id="door-color"
                label="สี"
                placeholder="-- เลือกสี --"
                options={colorOptions}
                value={color}
                onChange={setColor}
              />

              <SearchableSelect
                id="door-install"
                label="ตัวเลือกติดตั้ง"
                placeholder="เลือกตัวเลือก"
                options={["ติดตั้ง", "ไม่ติดตั้ง"]}
                value={installOption}
                onChange={setInstallOption}
                searchable={false}
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">พื้นที่: <span className="font-semibold">{area.toFixed(2)} ตร.ม.</span></p>
                {calculatedPrice > 0 ? (
                  <p className="mt-1 text-lg font-bold text-green-700">ราคา: {calculatedPrice.toLocaleString("th-TH")} บาท</p>
                ) : (
                  <p className="mt-1 text-sm text-amber-600">
                    {area > 0 && thickness ? "ไม่พบราคาสำหรับขนาดและความหนานี้" : "กรุณากรอกขนาดและเลือกความหนา"}
                  </p>
                )}
              </div>

              <button type="button" onClick={handleAddToCart} disabled={!selectedDoorType || !width || !length || !thickness || !color || calculatedPrice <= 0} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">
                <ShoppingCartIcon className="h-5 w-5" />
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg">
          <ShoppingCartIcon className="h-5 w-5" />
          เพิ่มลงตะกร้าเรียบร้อย!
        </div>
      )}
    </section>
  );
}
