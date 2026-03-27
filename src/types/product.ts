export type Product = {
  id: string;
  code: string;
  name: string;
  price: number;
  category: string;
  description: string;
  composition: string;
  slug: string;
  imageUrl: string;
  imageHoverUrl?: string;
};

export type ProductRaw = {
  id?: string;
  code?: string;
  name?: string;
  price?: string;
  category?: string;
  description?: string;
  composition?: string;
  slug?: string;
  image_url?: string;
  image_hover_url?: string;
};
