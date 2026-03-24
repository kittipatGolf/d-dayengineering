export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Derive safe extension from validated MIME type (never trust client filename)
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Magic bytes to verify file content matches declared MIME type
const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/gif": [0x47, 0x49, 0x46],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
  }

  if (files.length > 10) {
    return NextResponse.json({ error: "อัปโหลดได้สูงสุด 10 ไฟล์" }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const uploaded: { id: string; url: string; name: string; size: number; mimeType: string }[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `ไฟล์ ${file.name} ไม่ใช่รูปภาพที่รองรับ (jpeg, png, webp, gif)` },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `ไฟล์ ${file.name} มีขนาดเกิน 10MB` },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Verify magic bytes match declared MIME type
    const expected = MAGIC_BYTES[file.type];
    if (expected && !expected.every((b, i) => buffer[i] === b)) {
      return NextResponse.json(
        { error: `ไฟล์ ${file.name} เนื้อหาไม่ตรงกับประเภทที่ระบุ` },
        { status: 400 },
      );
    }

    // Use extension from validated MIME type, not from filename
    const ext = MIME_TO_EXT[file.type] || "jpg";
    const uniqueId = crypto.randomUUID();
    const uniqueName = `${uniqueId}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    await writeFile(filePath, buffer);

    uploaded.push({
      id: uniqueId,
      url: `/uploads/${uniqueName}`,
      name: file.name,
      size: file.size,
      mimeType: file.type,
    });
  }

  return NextResponse.json(uploaded, { status: 201 });
}
