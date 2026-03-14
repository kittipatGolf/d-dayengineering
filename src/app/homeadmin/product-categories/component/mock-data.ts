import type { ProductCategory } from "./types";

export const defaultColors = [
  "ขาว",
  "ครีม",
  "เทาเข้ม",
  "ดำ",
  "น้ำเงิน",
  "แดง",
  "เขียว",
];

export const initialCategories: ProductCategory[] = [
  {
    id: "CAT-001",
    name: "ประตูม้วนทึบ",
    kind: "ประตูม้วน",
    colors: ["ครีม", "ขาว", "เทาเข้ม"],
    isActive: true,
    updatedAt: "14 มี.ค. 2026",
  },
  {
    id: "CAT-002",
    name: "ประตูม้วนโปร่ง",
    kind: "ประตูม้วน",
    colors: ["เงิน", "ดำ"],
    isActive: true,
    updatedAt: "13 มี.ค. 2026",
  },
  {
    id: "CAT-003",
    name: "มอเตอร์",
    kind: "อะไหล่",
    colors: [],
    isActive: true,
    updatedAt: "12 มี.ค. 2026",
  },
];
