import { AboutPhilosophy } from "@/components/home/AboutPhilosophy";
import { Benefits } from "@/components/home/Benefits";
import { FaqTeaser } from "@/components/home/FaqTeaser";
import { Hero } from "@/components/home/Hero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import {
  fetchHomePageCategories,
  fetchHomePageSettings,
  fetchProducts,
} from "@/lib/google-sheets";
import type { Product } from "@/types/product";

export const revalidate = 60;

export default async function Home() {
  let products: Product[] = [];
  const [settings, homeCategories] = await Promise.all([
    fetchHomePageSettings(),
    fetchHomePageCategories(),
  ]);

  try {
    products = await fetchProducts();
  } catch {
    products = [];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col bg-background text-foreground">
        <Hero settings={settings} />

        <div className="hidden" id="cat-Пасха" />
        <div className="hidden" id="cat-Наборы" />
        <div className="hidden" id="cat-Клубника" />

        <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24">
          <ProductCatalog
            products={products}
            homeCategories={homeCategories}
            categoriesEyebrow={settings.categories_eyebrow}
            categoriesTitle={settings.categories_title}
            showCatalogSection={false}
            categoryHrefBase="/catalog"
          />
        </section>

        <AboutPhilosophy />

        <Benefits />

        <FaqTeaser />

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
