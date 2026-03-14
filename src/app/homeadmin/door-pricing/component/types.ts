export type DoorPricingRow = {
  id: string;
  categoryId: string;
  categoryName: string;
  thickness: string;
  minArea: number;
  maxArea: number;
  pricePerSqm: number;
  updatedAt: string;
};

export type DoorPricingFormState = {
  categoryId: string;
  mode: "existing" | "new";
  selectedThickness: string;
  newThickness: string;
  minArea: string;
  maxArea: string;
  pricePerSqm: string;
};
