export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  updatedAt: string;
};

export type PortfolioFormState = {
  title: string;
  description: string;
  images: string[];
};
