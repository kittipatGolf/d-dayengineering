"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { PortfolioItem } from "./types";

type PortfolioCardProps = {
  item: PortfolioItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function PortfolioCard({ item, onEdit, onDelete }: PortfolioCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = item.images ?? [];
  const hasMultiple = images.length > 1;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {images.length > 0 ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex]}
              alt={`${item.title} - ${currentIndex + 1}`}
              className="h-full w-full object-cover transition-opacity"
            />

            {/* Navigation arrows — visible on hover */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 group-hover:opacity-100"
                  aria-label="รูปก่อนหน้า"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 group-hover:opacity-100"
                  aria-label="รูปถัดไป"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Image count badge */}
            {hasMultiple && (
              <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </span>
            )}

            {/* Dot indicators */}
            {hasMultiple && images.length <= 6 && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    }`}
                    aria-label={`รูปที่ ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <PhotoIcon className="h-7 w-7" />
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{item.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>

        <div className="pt-2">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(item.id)}
              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
              aria-label="แก้ไขผลงาน"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
              aria-label="ลบผลงาน"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
