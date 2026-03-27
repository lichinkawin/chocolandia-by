"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ProductImage } from "@/components/products/ProductImage";
import { formatBynPrice } from "@/lib/price";
import { useCart } from "@/store/useCart";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  /** Optional decorative badge (UI only) */
  badgeLabel?: string;
};

export function ProductCard({
  product,
  priority = false,
  badgeLabel,
}: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const cartItem = useCart((state) =>
    state.items.find((item) => item.id === product.id),
  );
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const quantity = cartItem?.quantity ?? 0;

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      id: product.id,
      code: product.code,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      slug: product.slug,
      quantity: 1,
    });

    setIsAddedFeedback(true);
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = setTimeout(() => {
      setIsAddedFeedback(false);
    }, 900);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-[0_12px_40px_-18px_rgba(30,27,19,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-20px_rgba(39,19,16,0.16)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {badgeLabel ? (
            <span className="absolute left-3 top-3 z-10 rounded-sm bg-secondary-container px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container shadow-sm">
              {badgeLabel}
            </span>
          ) : null}
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground-muted">
            {product.category}
          </p>
          <h3 className="line-clamp-2 font-serif text-lg leading-snug text-primary-cocoa">
            {product.name}
          </h3>
          <p className="mt-auto font-serif text-xl font-medium tracking-tight text-primary-cocoa">
            {formatBynPrice(product.price)}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className={`w-full rounded-md border py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition duration-200 active:scale-[0.98] ${
              isAddedFeedback
                ? "border-accent bg-accent text-white shadow-sm"
                : "border-outline-variant/50 bg-muted-low text-foreground hover:border-accent/40 hover:bg-card"
            }`}
          >
            {isAddedFeedback
              ? "Добавлено ✓"
              : quantity > 0
                ? `В корзине · ${quantity}`
                : "В корзину →"}
          </button>
        </div>
      </article>
    </Link>
  );
}
