"use client";

import { useEffect, useRef, useState } from "react";
import { formatBynPrice } from "@/lib/price";
import { useCart } from "@/store/useCart";
import type { Product } from "@/types/product";

type AddToCartPanelProps = {
  product: Product;
};

export function AddToCartPanel({ product }: AddToCartPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const handleAdd = () => {
    addItem({
      id: product.id,
      code: product.code,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      slug: product.slug,
      quantity,
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
    <div
      className="
        fixed bottom-0 left-0 right-0 z-30 border-t border-outline-variant/40 bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-12px_rgba(39,19,16,0.12)] backdrop-blur-lg
        lg:static lg:z-auto lg:border-0 lg:bg-muted-low/60 lg:p-5 lg:pb-5 lg:shadow-none lg:backdrop-blur-none
        rounded-t-xl lg:rounded-xl
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="inline-flex items-center rounded-md border border-outline-variant/50 bg-muted-low">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="px-4 py-3 text-sm transition hover:bg-muted"
          >
            −
          </button>
          <span className="min-w-12 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-4 py-3 text-sm transition hover:bg-muted"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 rounded-md px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 active:scale-[0.99] ${
            isAddedFeedback
              ? "bg-accent text-white shadow-md ring-2 ring-accent/30"
              : "bg-gradient-to-r from-primary-cocoa to-primary-container text-white shadow-[0_16px_40px_-16px_rgba(39,19,16,0.45)] hover:opacity-95"
          }`}
        >
          {isAddedFeedback
            ? "Добавлено ✓"
            : `В корзину · ${formatBynPrice(product.price * quantity)}`}
        </button>
      </div>
    </div>
  );
}
