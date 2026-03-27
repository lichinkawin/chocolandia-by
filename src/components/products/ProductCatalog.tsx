"use client";

import { useEffect, useMemo, useState } from "react";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { ProductCard } from "@/components/products/ProductCard";
import type { HomePageCategory } from "@/types/home";
import type { Product } from "@/types/product";

function badgeForIndex(index: number): string | undefined {
  if (index % 5 === 0) return "Лимит";
  if (index % 5 === 2) return "Хит";
  return undefined;
}

type ProductCatalogProps = {
  products: Product[];
  homeCategories: HomePageCategory[];
  categoriesEyebrow: string;
  categoriesTitle: string;
  showCatalogSection?: boolean;
  initialFilter?: string;
  categoryHrefBase?: string;
};

export function ProductCatalog({
  products,
  homeCategories,
  categoriesEyebrow,
  categoriesTitle,
  showCatalogSection = true,
  initialFilter = "Все",
  categoryHrefBase,
}: ProductCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const visibleLimit = 9;

  const filteredProducts = useMemo(() => {
    if (activeFilter === "Все") return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter, products]);

  useEffect(() => {
    setShowAllProducts(false);
  }, [activeFilter]);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  const visibleProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, visibleLimit);

  return (
    <div className="space-y-16 md:space-y-20">
      <ShopByCategory
        active={activeFilter}
        onChange={setActiveFilter}
        categories={homeCategories}
        eyebrow={categoriesEyebrow}
        title={categoriesTitle}
        categoryHrefBuilder={
          categoryHrefBase
            ? (filterKey) =>
                `${categoryHrefBase}?category=${encodeURIComponent(filterKey)}`
            : undefined
        }
      />

      {showCatalogSection ? (
        <div id="catalog" className="scroll-mt-32 space-y-10">
        <div className="text-center">
          <h2 className="mt-3 font-serif text-3xl text-primary-cocoa sm:text-4xl md:text-5xl">
            Наши десерты
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-foreground-muted md:text-base">
            Каждое изделие — ручная работа, бельгийское сырьё и внимание к деталям.
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="rounded-xl bg-muted-low/90 py-20 text-center text-sm text-foreground-muted">
            В этой категории пока нет товаров.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={`${String(product.id)}-${String(product.slug)}-${index}`}
                product={product}
                priority={index < 4}
                badgeLabel={badgeForIndex(index)}
              />
            ))}
          </div>
        )}

        {filteredProducts.length > visibleLimit ? (
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setShowAllProducts((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md border border-outline-variant/50 bg-muted-low px-8 py-3 text-sm font-semibold text-primary-cocoa transition hover:border-accent/45 hover:bg-card"
            >
              {showAllProducts ? "Скрыть" : "Показать больше"}
            </button>
          </div>
        ) : null}
        </div>
      ) : null}
    </div>
  );
}
