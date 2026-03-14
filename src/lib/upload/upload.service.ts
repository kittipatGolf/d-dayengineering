import type { UploadedImage } from "./upload.types";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `up-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

// Placeholder uploader: replace this with real API multipart upload later.
export async function uploadImages(files: File[]): Promise<UploadedImage[]> {
  const uploaded = files.map((file) => ({
    id: makeId(),
    url: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    mimeType: file.type,
  }));

  return Promise.resolve(uploaded);
}

export function revokeImageUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
