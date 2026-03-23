"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryFilterPanel } from "@/components/category-filter-panel";
import { SearchBar } from "@/components/search-bar";
import { useCart } from "@/lib/cart-context";
import { Cog6ToothIcon, ShoppingCartIcon, ShieldCheckIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ProductImageCarousel } from "@/components/product-image-carousel";

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
  const router = useRouter();
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
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
        .catch((err) => console.error("Failed to fetch products:", err)),
      fetch("/api/product-categories")
        .then((r) => r.json())
        .then((data: ProductCategory[]) => setCategories(data.filter((c) => c.kind === "อะไหล่" && c.isActive)))
        .catch((err) => console.error("Failed to fetch product categories:", err)),
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
    setAddedToCart(true);
  };

  return (
    <section className="space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-blue-800 to-slate-900 px-8 py-12 text-white shadow-lg md:px-14 md:py-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="relative text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Cog6ToothIcon className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold md:text-5xl">อะไหล่ประตูม้วน</h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-blue-200/80">
            อะไหล่แท้คุณภาพสูง มอเตอร์ รีโมท สปริง โซ่ รอก พร้อมจัดส่งและติดตั้ง
          </p>
        </div>
      </div>

      <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 lg:grid-cols-[260px_1fr]">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`รายละเอียด ${detailItem.name}`}
          onKeyDown={(e) => { if (e.key === "Escape") setDetailItem(null); }}
          onClick={() => setDetailItem(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              aria-label="ปิด"
              onClick={() => setDetailItem(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* Image carousel */}
            <ProductImageCarousel
              images={detailItem.images}
              alt={detailItem.name}
              emptySlot={
                <div className="flex aspect-4/3 items-center justify-center bg-linear-to-br from-indigo-900 via-blue-800 to-slate-900">
                  <Cog6ToothIcon className="h-16 w-16 text-white/30" />
                </div>
              }
            />

            {/* Content */}
            <div className="max-h-[50vh] overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {detailItem.categoryName}
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">{detailItem.name}</h2>
                </div>

                {detailItem.description && (
                  <p className="text-sm leading-relaxed text-slate-600">{detailItem.description}</p>
                )}

                {/* Price & warranty row */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-bold text-blue-700">
                    {detailItem.price ? `฿${detailItem.price.toLocaleString("th-TH")}` : "สอบถามราคา"}
                  </span>
                  {detailItem.warrantyYears && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <ShieldCheckIcon className="h-3.5 w-3.5" />
                      รับประกัน {detailItem.warrantyYears} ปี
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => { handleAddToCart(detailItem); setDetailItem(null); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Added-to-Cart Modal ---------- */}
      {addedToCart && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setAddedToCart(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center px-6 pt-8 pb-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircleIcon className="h-9 w-9 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">เพิ่มลงตะกร้าแล้ว!</h3>
              <p className="mt-1 text-sm text-slate-500">คุณต้องการดำเนินการต่ออย่างไร?</p>
            </div>
            <div className="flex flex-col gap-3 p-6">
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                ไปที่ตะกร้า
              </button>
              <button
                type="button"
                onClick={() => setAddedToCart(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
              >
                เลือกซื้อต่อ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
