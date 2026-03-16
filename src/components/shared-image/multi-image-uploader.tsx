"use client";

import { useRef, useState } from "react";
import { CloudArrowUpIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { uploadImages } from "@/lib/upload/upload.service";

type MultiImageUploaderProps = {
  value: string[];
  onChange: (next: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
};

export function MultiImageUploader({
  value,
  onChange,
  maxFiles = 10,
  maxSizeMB = 10,
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const canAdd = value.length < maxFiles;

  const onPick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxBytes = maxSizeMB * 1024 * 1024;
    const oversized = Array.from(files).filter((f) => f.size > maxBytes);
    if (oversized.length > 0) {
      setError(`ไฟล์บางรายการเกิน ${maxSizeMB} MB`);
    } else {
      setError("");
    }

    const selected = Array.from(files)
      .filter((file) => file.size <= maxBytes)
      .slice(0, Math.max(0, maxFiles - value.length));

    if (selected.length === 0) return;

    setUploading(true);
    try {
      const uploaded = await uploadImages(selected);
      onChange([...value, ...uploaded.map((img) => img.url)]);
      setError("");
    } catch {
      setError("อัปโหลดรูปภาพล้มเหลว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
    }
  };

  const onRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        title="เลือกรูปภาพ"
        className="hidden"
        onChange={(e) => {
          onPick(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      {/* thumbnails grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {value.map((url, index) => (
            <div key={url} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`รูป ${index + 1}`}
                className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <button
                type="button"
                title="ลบรูปภาพ"
                aria-label={`ลบรูป ${index + 1}`}
                onClick={() => onRemove(index)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 shadow-sm transition group-hover:opacity-100"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
              {/* number badge */}
              <span className="absolute bottom-1 left-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-black/50 px-1 text-[10px] font-medium text-white">
                {index + 1}
              </span>
            </div>
          ))}

          {/* inline add button */}
          {canAdd && !uploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-[10px] font-medium">เพิ่มรูป</span>
            </button>
          )}
        </div>
      )}

      {/* empty state / drop zone */}
      {value.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-8 text-slate-400 transition hover:border-blue-400 hover:bg-blue-50/30 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CloudArrowUpIcon className="h-10 w-10" />
          <span className="text-sm font-medium">
            {uploading ? "กำลังอัปโหลด..." : "คลิกเพื่อเลือกรูปภาพ"}
          </span>
          <span className="text-xs text-slate-400">สูงสุด {maxFiles} รูป, ไม่เกิน {maxSizeMB} MB ต่อรูป</span>
        </button>
      )}

      {/* uploading indicator */}
      {uploading && value.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          กำลังอัปโหลด...
        </div>
      )}

      {error && (
        <p className="text-sm text-rose-600">{error}</p>
      )}

      {value.length > 0 && (
        <p className="text-xs text-slate-400">{value.length}/{maxFiles} รูปภาพ</p>
      )}
    </div>
  );
}
