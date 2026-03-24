export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  images: string[];
  updatedAt: string;
};

export type PortfolioFormState = {
  title: string;
  description: string;
  images: string[];
};
