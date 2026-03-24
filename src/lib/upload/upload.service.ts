import type { UploadedImage } from "./upload.types";

export async function uploadImages(files: File[]): Promise<UploadedImage[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const res = await fetch("/api/upload", { method: "POST", body: formData });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "อัปโหลดไม่สำเร็จ");
  }

  return res.json();
}

export function revokeImageUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
