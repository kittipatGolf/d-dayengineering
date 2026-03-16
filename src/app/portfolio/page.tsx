"use client";

import { useEffect, useState } from "react";
import { XMarkIcon, PhotoIcon, EyeIcon, CameraIcon } from "@heroicons/react/24/outline";
import { SearchBar } from "@/components/search-bar";
import { ProductImageCarousel } from "@/components/product-image-carousel";

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.description.toLowerCase().includes(query.toLowerCase()),
      )
    : items;

  return (
    <section className="space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-8 py-12 text-white shadow-lg md:px-14 md:py-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <CameraIcon className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold md:text-5xl">ผลงานของเรา</h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-blue-200/80">
            ผลงานติดตั้งและซ่อมประตูม้วนจาก D-Day Engineering
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <div className="mx-auto sm:ml-auto sm:mr-0 w-full max-w-md">
        <SearchBar className="max-w-none" value={query} onChange={setQuery} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-12">ยังไม่มีผลงาน</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="animate-fade-in-up group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                {item.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-300 via-slate-400 to-slate-500">
                    <PhotoIcon className="h-12 w-12 text-white/50" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                    <EyeIcon className="h-4 w-4" />
                    ดูผลงาน
                  </span>
                </div>

                {/* Image count badge */}
                {item.images.length > 1 && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    <PhotoIcon className="h-3 w-3" />
                    {item.images.length}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 line-clamp-2">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      </div>

      {/* Detail modal with carousel */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setSelected(null)} />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelected(null)}
            onKeyDown={(e) => { if (e.key === "Escape") setSelected(null); }}
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h2 className="text-xl font-bold text-slate-900">{selected.title}</h2>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="ปิด"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Image carousel */}
              <ProductImageCarousel
                images={selected.images}
                alt={selected.title}
                emptySlot={
                  <div className="flex aspect-4/3 items-center justify-center bg-linear-to-br from-slate-300 via-slate-500 to-slate-700">
                    <PhotoIcon className="h-16 w-16 text-white/50" />
                  </div>
                }
              />

              {/* Description */}
              {selected.description && (
                <div className="px-5 py-4">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selected.description}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
