import type { CategoryKind } from "../../product-categories/component/types";

export type ProductStatus = "วางขาย" | "ยกเลิกการขาย";
export type ProductTab = "ทั้งหมด" | "ประตูม้วน" | "อะไหล่ประตูม้วน";

export type ProductItem = {
  id: string;
  name: string;
  kind: CategoryKind;
  categoryId: string;
  categoryName: string;
  price: number;
  color: string;
  images: string[];
  status: ProductStatus;
  updatedAt: string;
};

export type ProductFormState = {
  name: string;
  categoryId: string;
  price: string;
  color: string;
  images: string[];
};
