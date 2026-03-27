export type HomePageSettings = {
  hero_heading: string;
  hero_subheading: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  /** Normalized path e.g. /NEW/hero_bg.jpg */
  hero_image_url?: string;
  brand_line: string;
  categories_eyebrow: string;
  categories_title: string;
};

export type HomePageCategory = {
  category_name: string;
  initial_letters: string;
  sub_label: string;
  /** Must match `product.category` for filtering */
  filter_key: string;
  /** Normalized path e.g. /NEW/cat.jpg */
  card_image_url?: string;
};
