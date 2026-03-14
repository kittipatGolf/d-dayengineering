"use client";

import { useState } from "react";
import { MultiImageUploader } from "@/components/shared-image/multi-image-uploader";
import type { UploadedImage } from "@/lib/upload/upload.types";

export function ImageUploadField() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  return (
    <div className="space-y-2">
      <p className="font-medium text-slate-700">เพิ่มรูปภาพ</p>
      <MultiImageUploader value={images} onChange={setImages} maxFiles={10} maxSizeMB={10} />
    </div>
  );
}
