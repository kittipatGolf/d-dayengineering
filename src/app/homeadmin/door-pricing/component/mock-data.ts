import type { DoorPricingFormState, DoorPricingRow } from "./types";

export const initialDoorPricingRows: DoorPricingRow[] = [
  {
    id: "DP-001",
    categoryId: "CAT-001",
    categoryName: "ประตูม้วนทึบ",
    thickness: "1.2 mm (เบอร์ 18)",
    minArea: 1,
    maxArea: 36,
    pricePerSqm: 2500,
    updatedAt: "14 มี.ค. 2026",
  },
  {
    id: "DP-002",
    categoryId: "CAT-001",
    categoryName: "ประตูม้วนทึบ",
    thickness: "0.9-1.0 mm (เบอร์ 20)",
    minArea: 1,
    maxArea: 20,
    pricePerSqm: 3000,
    updatedAt: "13 มี.ค. 2026",
  },
  {
    id: "DP-003",
    categoryId: "CAT-002",
    categoryName: "ประตูม้วนโปร่ง",
    thickness: "0.6-0.7 mm (เบอร์ 22)",
    minArea: 1,
    maxArea: 36,
    pricePerSqm: 2000,
    updatedAt: "12 มี.ค. 2026",
  },
];

export const emptyDoorPricingForm: DoorPricingFormState = {
  categoryId: "",
  mode: "existing",
  selectedThickness: "",
  newThickness: "",
  minArea: "1",
  maxArea: "",
  pricePerSqm: "",
};
