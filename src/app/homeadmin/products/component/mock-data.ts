import type { ProductFormState, ProductItem } from "./types";

export const initialProducts: ProductItem[] = [
  {
    id: "PD-001",
    name: "ประตูม้วนทึบ รุ่นมาตรฐาน",
    kind: "ประตูม้วน",
    categoryId: "CAT-001",
    categoryName: "ประตูม้วนทึบ",
    price: 2300,
    color: "ครีม",
    images: [],
    status: "วางขาย",
    updatedAt: "14 มี.ค. 2026",
  },
  {
    id: "PD-002",
    name: "มอเตอร์ 600KG",
    kind: "อะไหล่",
    categoryId: "CAT-003",
    categoryName: "มอเตอร์",
    price: 4200,
    color: "-",
    images: [],
    status: "วางขาย",
    updatedAt: "13 มี.ค. 2026",
  },
];

export const emptyProductForm: ProductFormState = {
  name: "",
  categoryId: "",
  price: "",
  color: "",
  images: [],
};
