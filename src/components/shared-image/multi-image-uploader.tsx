"use client";

import { useRef, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { revokeImageUrl, uploadImages } from "@/lib/upload/upload.service";
import type { UploadedImage } from "@/lib/upload/upload.types";

type MultiImageUploaderProps = {
  value: UploadedImage[];
  onChange: (next: UploadedImage[]) => void;
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

  const onPick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxBytes = maxSizeMB * 1024 * 1024;
    const selected = Array.from(files)
      .filter((file) => file.size <= maxBytes)
      .slice(0, Math.max(0, maxFiles - value.length));

    if (selected.length === 0) return;

    setUploading(true);
    try {
      const uploaded = await uploadImages(selected);
      onChange([...value, ...uploaded]);
    } finally {
      setUploading(false);
    }
  };

  const onRemove = (index: number) => {
    const target = value[index];
    if (target) {
      revokeImageUrl(target.url);
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-slate-200">
      <div className="border-b border-slate-200 p-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            onPick(e.target.files);
            e.currentTarget.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || value.length >= maxFiles}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PlusIcon className="h-4 w-4" />
          {uploading ? "กำลังอัปโหลด..." : "เลือกรูปภาพ"}
        </button>
      </div>

      <div className="p-3">
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {value.map((img, index) => (
              <div key={img.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} className="h-16 w-16 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute -right-1 -top-1 rounded-full bg-slate-900 p-0.5 text-white"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">ยังไม่ได้เลือกรูปภาพ</p>
        )}
      </div>
    </div>
  );
}
