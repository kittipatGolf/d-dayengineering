"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type ProductImageCarouselProps = {
  images: string[];
  alt: string;
  emptySlot?: React.ReactNode;
};

export function ProductImageCarousel({ images, alt, emptySlot }: ProductImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return <>{emptySlot}</>;
  }

  const hasMulitple = images.length > 1;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative">
      {/* Main image */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${alt} - ${index + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />

        {/* Gradient overlay bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/30 to-transparent" />

        {hasMulitple && (
          <>
            {/* Prev / Next */}
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white"
              aria-label="รูปก่อนหน้า"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white"
              aria-label="รูปถัดไป"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            {/* Counter badge */}
            <span className="absolute left-3 top-3 rounded-lg bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {index + 1} / {images.length}
            </span>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`ไปรูปที่ ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMulitple && (
        <div className="flex gap-1.5 overflow-x-auto bg-slate-50 p-2.5">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`shrink-0 h-14 w-14 overflow-hidden rounded-lg border-2 transition ${
                i === index
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`ดูรูปที่ ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
