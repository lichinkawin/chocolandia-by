"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/store/useCart";

const collections = ["Пасха", "Наборы", "Клубника"] as const;
const navLinks = [
  { label: "Отзывы", href: "/faq#reviews" },
  { label: "О нас", href: "/#about" },
  { label: "Контакты", href: "/contacts" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const hideMobileCartFab = pathname.startsWith("/product/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const items = useCart((state) => state.items);

  const itemsCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const cartButtonClasses =
    "group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/50 bg-card/70 shadow-[0_8px_32px_-12px_rgba(39,19,16,0.2)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-card hover:shadow-[0_14px_40px_-14px_rgba(39,19,16,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/20 bg-background/88 shadow-[0_10px_40px_-18px_rgba(39,19,16,0.07)] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:gap-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 transition hover:bg-muted-low md:hidden"
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5 text-primary-cocoa" />
            </button>

            <Link
              href="/"
              className="shrink-0 font-serif text-lg italic tracking-tight text-primary-cocoa sm:text-2xl md:text-[1.65rem]"
            >
              CHOCOLANDIA.BY
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              <div
                className="relative"
                onMouseEnter={() => setCatalogOpen(true)}
                onMouseLeave={() => setCatalogOpen(false)}
              >
                <Link
                  href="/catalog"
                  className="font-serif text-base tracking-tight text-primary-container transition hover:text-accent"
                  onClick={() => setCatalogOpen((prev) => !prev)}
                  aria-expanded={catalogOpen}
                  aria-haspopup="menu"
                >
                  Каталог
                </Link>
                <div
                  className={`absolute left-0 top-full z-50 min-w-[220px] pt-3 transition ${
                    catalogOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="rounded-xl border border-outline-variant/25 bg-card/95 p-2 shadow-[0_24px_60px_-20px_rgba(39,19,16,0.2)] backdrop-blur-lg">
                    {collections.map((collection) => (
                      <Link
                        key={collection}
                        href={`/catalog?category=${encodeURIComponent(collection)}`}
                        className="block rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition hover:bg-muted-low hover:text-foreground"
                        onClick={() => setCatalogOpen(false)}
                      >
                        {collection}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-serif text-base tracking-tight text-primary-container transition hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="https://www.instagram.com/chocolandia.by/"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden rounded-full border border-outline-variant/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-muted transition hover:border-accent/40 hover:bg-muted-low hover:text-foreground xl:inline-flex"
            >
              Instagram
            </Link>

            <Link
              href="/cart"
              className={`${cartButtonClasses} hidden md:inline-flex`}
              aria-label="Перейти в корзину"
            >
              <ShoppingBag className="h-5 w-5 text-primary-cocoa transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110" />
              {itemsCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white shadow-md ring-2 ring-background">
                  {itemsCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      {!hideMobileCartFab ? (
        <Link
          href="/cart"
          className={`${cartButtonClasses} fixed bottom-6 right-5 z-40 md:hidden`}
          aria-label="Перейти в корзину"
        >
          <ShoppingBag className="h-5 w-5 text-primary-cocoa transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110" />
          {itemsCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white shadow-md ring-2 ring-background">
              {itemsCount}
            </span>
          ) : null}
        </Link>
      ) : null}

      <div
        className={`fixed inset-0 z-[60] transition ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Закрыть меню"
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-primary-cocoa/30 backdrop-blur-sm transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-outline-variant/30 bg-card/98 p-6 shadow-2xl backdrop-blur-xl transition-transform ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <p className="font-serif text-lg text-primary-cocoa">Меню</p>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 transition hover:bg-muted-low"
              aria-label="Закрыть меню"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
            <div className="space-y-1 pb-4">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Каталог
              </p>
              {collections.map((collection) => (
                <Link
                  key={collection}
                  href={`/catalog?category=${encodeURIComponent(collection)}`}
                  className="rounded-lg px-3 py-2.5 font-serif text-foreground/90 transition hover:bg-muted-low"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {collection}
                </Link>
              ))}
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2.5 font-serif text-foreground/90 transition hover:bg-muted-low"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://www.instagram.com/chocolandia.by/"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg px-3 py-2.5 text-foreground/90 transition hover:bg-muted-low"
              onClick={() => setMobileMenuOpen(false)}
            >
              Instagram
            </Link>
            <Link
              href="/cart"
              className="mt-4 rounded-lg border border-outline-variant/40 px-3 py-3 text-center font-medium text-primary-cocoa transition hover:bg-muted-low"
              onClick={() => setMobileMenuOpen(false)}
            >
              Корзина {itemsCount > 0 ? `(${itemsCount})` : ""}
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
