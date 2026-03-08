"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(3)} KB`;
}

export function ImageUploadField() {
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);

  const previewUrls = useMemo(() => uploadItems.map((item) => item.previewUrl), [uploadItems]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploadItems((prev) => {
      const next = files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...next];
    });

    event.target.value = "";
  }

  function removeFile(id: string) {
    setUploadItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  }

  return (
    <div className="space-y-2">
      <p className="font-medium text-slate-700">เพิ่มรูปภาพ</p>
      <div className="overflow-hidden rounded-md border border-slate-300">
        <div className="border-b border-slate-300 p-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
            <span className="text-[16px] leading-none">+</span>
            เลือกไฟล์
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div className="bg-white p-4">
          {uploadItems.length === 0 ? (
            <div className="h-24" />
          ) : (
            <div className="space-y-8">
              {uploadItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <Image
                      src={item.previewUrl}
                      alt={item.file.name}
                      width={48}
                      height={44}
                      unoptimized
                      className="h-11 w-12 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className="break-all text-slate-700">{item.file.name}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-slate-600">{formatFileSize(item.file.size)}</span>
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[13px] font-semibold text-slate-800">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`ลบไฟล์ ${item.file.name}`}
                    className="shrink-0 cursor-pointer rounded p-1 text-3xl leading-none text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    onClick={() => removeFile(item.id)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
