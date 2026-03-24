"use client";

import { useState } from "react";
import { MultiImageUploader } from "@/components/shared-image/multi-image-uploader";

type ImageUploadFieldProps = {
  value?: string[];
  onChange?: (images: string[]) => void;
};

export function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const [internalImages, setInternalImages] = useState<string[]>([]);

  const images = value !== undefined ? value : internalImages;

  const handleChange = (newImages: string[]) => {
    setInternalImages(newImages);
    onChange?.(newImages);
  };

  return (
    <div className="space-y-2">
      <p className="font-medium text-slate-700">เพิ่มรูปภาพ</p>
      <MultiImageUploader value={images} onChange={handleChange} maxFiles={10} maxSizeMB={10} />
    </div>
  );
}
