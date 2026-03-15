"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-4xl font-bold text-slate-900">สินค้าภายในร้าน</h2>
        <div className="flex gap-2">
          <Link
            href="/doors"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            ดูประตูม้วนทั้งหมด
          </Link>
          <Link
            href="/parts"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ดูอะไหล่ทั้งหมด
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-4/3 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-500">
          ยังไม่มีสินค้าในขณะนี้
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, i) => (
            <Link
              key={product.id}
              href={product.kind === "ประตูม้วน" ? "/doors" : "/parts"}
              className="animate-fade-in-up group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-300 via-slate-400 to-slate-500">
                    <span className="text-sm text-white/80">ไม่มีรูปภาพ</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                  <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
                    ดูรายละเอียด
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold leading-tight text-slate-700 sm:text-xl">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{product.categoryName}</p>
                <p className="mt-2 text-sm font-extrabold text-red-600 sm:text-base">
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
