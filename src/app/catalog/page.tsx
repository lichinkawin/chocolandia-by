import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import {
  fetchHomePageCategories,
  fetchHomePageSettings,
  fetchProducts,
} from "@/lib/google-sheets";
import type { Product } from "@/types/product";

type CatalogPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export const revalidate = 60;

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  let products: Product[] = [];
  const [{ category }, settings, homeCategories] = await Promise.all([
    searchParams,
    fetchHomePageSettings(),
    fetchHomePageCategories(),
  ]);

  try {
    products = await fetchProducts();
  } catch {
    products = [];
  }

  const safeInitialFilter =
    category && homeCategories.some((cat) => cat.filter_key === category)
      ? category
      : "Все";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl flex-1 bg-background px-4 pb-16 pt-[88px] sm:px-6 sm:pb-20 sm:pt-[96px] lg:px-12">
        <ProductCatalog
          products={products}
          homeCategories={homeCategories}
          categoriesEyebrow={settings.categories_eyebrow}
          categoriesTitle={settings.categories_title}
          showCatalogSection
          initialFilter={safeInitialFilter}
          categoryHrefBase="/catalog"
        />
      </main>
      <Footer />
    </div>
  );
}
