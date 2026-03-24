"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

type ProductItem = {
  id: string;
  name: string;
  kind: string;
  categoryName: string;
  price: number | null;
  images: string[];
  status: string;
};

export function StoreProductsSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ProductItem[]) =>
        setProducts(data.filter((p) => p.status === "วางขาย").slice(0, 8)),
      )
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-amber-500" />
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">Featured</p>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-4xl">สินค้าภายในร้าน</h2>
          <p className="mt-1 text-sm text-slate-500">สินค้าแนะนำจากดีเดย์ ประตูม้วน</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/doors"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            ประตูม้วน
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/parts"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
          >
            อะไหล่
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-4/3 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-400">
          ยังไม่มีสินค้าในขณะนี้
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, i) => (
            <Link
              key={product.id}
              href={product.kind === "ประตูม้วน" ? "/doors" : "/parts"}
              className="animate-fade-in-up group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-200 via-slate-300 to-slate-400">
                    <span className="text-sm font-medium text-white/80">ไม่มีรูปภาพ</span>
                  </div>
                )}
                {/* hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
                    ดูรายละเอียด
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
                {/* kind badge */}
                <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                  {product.kind === "ประตูม้วน" ? "ประตูม้วน" : "อะไหล่"}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-slate-400">{product.categoryName}</p>
                <h3 className="mt-1 text-base font-bold leading-tight text-slate-800 line-clamp-1">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm font-bold text-blue-600">
                  {product.kind === "ประตูม้วน"
                    ? "ราคาขึ้นอยู่กับขนาด"
                    : product.price
                      ? `฿${product.price.toLocaleString()}`
                      : "สอบถามราคา"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
