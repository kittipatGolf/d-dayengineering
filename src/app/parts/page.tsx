"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryFilterPanel } from "@/components/category-filter-panel";
import { SearchBar } from "@/components/search-bar";
import { useCart } from "@/lib/cart-context";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";

type ProductItem = {
  id: string;
  name: string;
  kind: string;
  categoryId: string;
  categoryName: string;
  price: number | null;
  colors: string[];
  description: string;
  warrantyYears: string;
  images: string[];
  status: string;
};

type ProductCategory = {
  id: string;
  name: string;
  kind: string;
  isActive: boolean;
};

export default function PartsPage() {
  const { addItem } = useCart();
  const [toast, setToast] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailItem, setDetailItem] = useState<ProductItem | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/products")
        .then((r) => r.json())
        .then((data: ProductItem[]) => setProducts(data.filter((p) => p.kind === "อะไหล่" && p.status === "วางขาย")))
        .catch(() => {}),
      fetch("/api/product-categories")
        .then((r) => r.json())
        .then((data: ProductCategory[]) => setCategories(data.filter((c) => c.kind === "อะไหล่" && c.isActive)))
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const categoryNames = useMemo(
    () => ["ทั้งหมด", ...categories.map((c) => c.name)],
    [categories],
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

  const handleAddToCart = (part: ProductItem) => {
    addItem({
      type: "part",
      name: part.name,
      categoryName: part.categoryName,
      images: part.images,
      color: "-",
      widthM: 0,
      lengthM: 0,
      thickness: "-",
      installOption: "-",
      quantity: 1,
      pricePerUnit: part.price ?? 0,
      warranty: part.warrantyYears ? `${part.warrantyYears} ปี` : "-",
    });
    setToast(part.name);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-center text-2xl sm:text-4xl font-bold text-slate-900">อะไหล่ประตูม้วน</h1>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-4">
          <SearchBar className="max-w-none" value={query} onChange={setQuery} />
          <CategoryFilterPanel
            title="หมวดหมู่อะไหล่"
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
          <p className="text-center text-slate-400 py-12">ยังไม่มีสินค้าอะไหล่</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((part, i) => (
              <div
                key={part.id}
                className="animate-fade-in-up group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => setDetailItem(part)}
              >
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  {part.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={part.images[0]} alt={part.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-200 via-slate-400 to-slate-600">
                      <span className="text-3xl text-white/60">🔩</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
                    <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
                      ดูรายละเอียด
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-sm font-bold text-slate-900">{part.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">{part.description}</p>
                  <p className="mt-auto pt-2 text-sm font-bold text-blue-700">
                    {part.price ? `${part.price.toLocaleString("th-TH")} บาท` : "-"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(part); }}
                  className="flex items-center justify-center gap-1.5 rounded-b-2xl bg-green-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-95"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  เพิ่มลงตะกร้า
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Detail Modal ---------- */}
      {detailItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`รายละเอียด ${detailItem.name}`}
          onKeyDown={(e) => { if (e.key === "Escape") setDetailItem(null); }}
          onClick={() => setDetailItem(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="ปิด"
              onClick={() => setDetailItem(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1 text-slate-400 hover:text-slate-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* images */}
            {detailItem.images.length > 0 ? (
              <div className="flex gap-1 overflow-x-auto">
                {detailItem.images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`${detailItem.name} ${i + 1}`}
                    className="h-56 min-w-[50%] flex-1 object-cover first:rounded-tl-2xl last:rounded-tr-2xl"
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center rounded-t-2xl bg-linear-to-br from-slate-200 via-slate-400 to-slate-600">
                <span className="text-5xl text-white/60">🔩</span>
              </div>
            )}

            <div className="space-y-3 p-5">
              <h2 className="text-xl font-bold text-slate-900">{detailItem.name}</h2>
              <p className="text-sm text-slate-500">หมวดหมู่: {detailItem.categoryName}</p>

              {detailItem.description && (
                <p className="text-sm leading-relaxed text-slate-700">{detailItem.description}</p>
              )}

              {detailItem.warrantyYears && (
                <p className="text-sm text-slate-600">รับประกัน: {detailItem.warrantyYears} ปี</p>
              )}

              <p className="text-lg font-bold text-blue-700">
                {detailItem.price ? `${detailItem.price.toLocaleString("th-TH")} บาท` : "ราคาไม่ระบุ"}
              </p>

              <button
                type="button"
                onClick={() => { handleAddToCart(detailItem); setDetailItem(null); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-green-700 active:scale-95"
              >
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
          เพิ่ม &quot;{toast}&quot; ลงตะกร้าเรียบร้อย!
        </div>
      )}
    </section>
  );
}
