export type CategoryKind = "ประตูม้วน" | "อะไหล่";

export type ProductCategory = {
  id: string;
  name: string;
  kind: CategoryKind;
  colors: string[];
  isActive: boolean;
  updatedAt: string;
};
