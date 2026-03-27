"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { formatBynPrice } from "@/lib/price";
import { useCart } from "@/store/useCart";

export function CartView() {
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <section className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:gap-12">
      <div className="space-y-4 rounded-xl bg-card p-6 shadow-[0_16px_48px_-24px_rgba(39,19,16,0.18)]">
        {items.length === 0 ? (
          <p className="py-12 text-center text-sm text-foreground-muted">Корзина пока пуста.</p>
        ) : (
          items.map((item, index) => (
            <article
              key={`${String(item.id)}-${String(item.slug)}-${index}`}
              className="flex items-start gap-4 rounded-xl border border-outline-variant/30 bg-muted-low/50 p-4"
            >
              <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-muted">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="font-serif text-base text-primary-cocoa">{item.name}</h3>
                <p className="text-sm text-foreground-muted">{formatBynPrice(item.price)}</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-md border border-outline-variant/50 bg-card">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 transition hover:bg-muted"
                      aria-label="Уменьшить"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 transition hover:bg-muted"
                      aria-label="Увеличить"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-md p-2 text-foreground-muted transition hover:bg-muted hover:text-foreground"
                    aria-label="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <aside className="h-fit space-y-6 rounded-xl border border-outline-variant/25 bg-muted-low/80 p-6 lg:sticky lg:top-28">
        <h2 className="font-serif text-2xl text-primary-cocoa">Оформление</h2>
        <div className="space-y-2 text-sm">
          <p className="flex items-center justify-between">
            <span className="text-foreground-muted">Сумма</span>
            <strong className="font-serif text-lg">{formatBynPrice(subtotal)}</strong>
          </p>
          <p className="text-foreground-muted">Доставка: уточняется с менеджером</p>
        </div>

        <form className="space-y-3">
          <input
            placeholder="Имя"
            className="w-full rounded-md border border-outline-variant/50 bg-card px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          />
          <input
            placeholder="+375XXXXXXXXX"
            className="w-full rounded-md border border-outline-variant/50 bg-card px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border border-outline-variant/50 bg-card px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          />
          <input
            placeholder="Адрес"
            className="w-full rounded-md border border-outline-variant/50 bg-card px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          />
          <input
            type="date"
            className="w-full rounded-md border border-outline-variant/50 bg-card px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          />
          <button
            type="button"
            className="w-full rounded-md bg-gradient-to-r from-primary-cocoa to-primary-container py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={items.length === 0}
          >
            Заказать
          </button>
        </form>
      </aside>
    </section>
  );
}
