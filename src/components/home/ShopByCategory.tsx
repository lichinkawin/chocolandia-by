"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomePageCategory } from "@/types/home";

type ShopByCategoryProps = {
  active: string;
  onChange: (filterKey: string) => void;
  categories: HomePageCategory[];
  eyebrow: string;
  title: string;
  categoryHrefBuilder?: (filterKey: string) => string;
};

function FeaturedOriginPromo() {
  return (
    <div className="group relative flex min-h-[260px] overflow-hidden rounded-xl bg-primary-container md:col-span-8">
      <div className="absolute right-5 top-5 z-10">
        <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
          Лимитированный выпуск
        </span>
      </div>
      <div className="grid h-full min-h-[260px] w-full grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-10">
          <h3 className="font-serif text-2xl text-white md:text-3xl">
            Одна плантация: Мадагаскар
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-on-primary-container">
            Яркие ноты цитруса и ягод в балансе с глубоким землистым финалом. Сезонный урожай — в
            ограниченном количестве.
          </p>
          <Link
            href="/catalog"
            className="mt-6 w-fit border-b border-accent-highlight pb-1 text-sm font-bold text-accent-highlight transition hover:text-white"
          >
            Смотреть в каталоге
          </Link>
        </div>
        <div className="relative min-h-[200px] bg-gradient-to-br from-primary-container via-primary-cocoa to-primary-container">
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="font-serif text-sm italic text-white/70">
              [ фото какао-бобов ]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryTile({
  cat,
  isActive,
  onSelect,
  href,
  className,
}: {
  cat: HomePageCategory;
  isActive: boolean;
  onSelect: () => void;
  href?: string;
  className?: string;
}) {
  const hasImage = Boolean(cat.card_image_url);

  if (hasImage && cat.card_image_url) {
    if (href) {
      return (
        <Link
          href={href}
          className={`group relative flex min-h-[260px] w-full overflow-hidden rounded-xl text-left shadow-[0_20px_50px_-28px_rgba(39,19,16,0.35)] transition ${className ?? ""} ${
            isActive
              ? "ring-2 ring-accent-highlight ring-offset-2 ring-offset-background"
              : "hover:ring-1 hover:ring-outline-variant/40"
          }`}
        >
          <Image
            src={cat.card_image_url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-cocoa/85 via-primary-cocoa/30 to-transparent opacity-90" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.35em] text-accent-highlight">
              Коллекция
            </span>
            <h3 className="font-serif text-3xl leading-tight">{cat.category_name}</h3>
            {cat.sub_label ? (
              <p className="mt-2 max-w-xs text-sm text-white/85">{cat.sub_label}</p>
            ) : null}
          </div>
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={onSelect}
        className={`group relative flex min-h-[260px] w-full overflow-hidden rounded-xl text-left shadow-[0_20px_50px_-28px_rgba(39,19,16,0.35)] transition ${className ?? ""} ${
          isActive
            ? "ring-2 ring-accent-highlight ring-offset-2 ring-offset-background"
            : "hover:ring-1 hover:ring-outline-variant/40"
        }`}
      >
        <Image
          src={cat.card_image_url}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-cocoa/85 via-primary-cocoa/30 to-transparent opacity-90" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.35em] text-accent-highlight">
            Коллекция
          </span>
          <h3 className="font-serif text-3xl leading-tight">{cat.category_name}</h3>
          {cat.sub_label ? (
            <p className="mt-2 max-w-xs text-sm text-white/85">{cat.sub_label}</p>
          ) : null}
        </div>
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={`flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-card p-8 text-center shadow-[0_16px_40px_-24px_rgba(39,19,16,0.2)] transition ${className ?? ""} ${
          isActive
            ? "ring-2 ring-accent-highlight ring-offset-2 ring-offset-background"
            : "hover:shadow-[0_20px_50px_-22px_rgba(39,19,16,0.18)]"
        }`}
      >
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full border text-sm font-semibold ${
            isActive
              ? "border-accent bg-accent-soft/50 text-primary-cocoa"
              : "border-outline-variant/50 bg-muted-low text-foreground/80"
          }`}
        >
          {cat.initial_letters.slice(0, 3)}
        </span>
        <h3 className="mt-4 font-serif text-xl text-primary-cocoa">{cat.category_name}</h3>
        {cat.sub_label ? (
          <p className="mt-2 text-sm text-foreground-muted">{cat.sub_label}</p>
        ) : null}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-card p-8 text-center shadow-[0_16px_40px_-24px_rgba(39,19,16,0.2)] transition ${className ?? ""} ${
        isActive
          ? "ring-2 ring-accent-highlight ring-offset-2 ring-offset-background"
          : "hover:shadow-[0_20px_50px_-22px_rgba(39,19,16,0.18)]"
      }`}
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full border text-sm font-semibold ${
          isActive
            ? "border-accent bg-accent-soft/50 text-primary-cocoa"
            : "border-outline-variant/50 bg-muted-low text-foreground/80"
        }`}
      >
        {cat.initial_letters.slice(0, 3)}
      </span>
      <h3 className="mt-4 font-serif text-xl text-primary-cocoa">{cat.category_name}</h3>
      {cat.sub_label ? (
        <p className="mt-2 text-sm text-foreground-muted">{cat.sub_label}</p>
      ) : null}
    </button>
  );
}

export function ShopByCategory({
  active,
  onChange,
  categories,
  eyebrow: _eyebrow,
  title,
  categoryHrefBuilder,
}: ShopByCategoryProps) {
  const visibleCategories = categories.filter(
    (cat) =>
      cat.filter_key.trim().toLowerCase() !== "все" &&
      cat.category_name.trim().toLowerCase() !== "все",
  );

  const n = visibleCategories.length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl space-y-3">
          <h2 className="font-serif text-3xl leading-tight text-primary-cocoa md:text-4xl lg:text-5xl">
            {title.trim() || "Коллекции"}
          </h2>
          <p className="max-w-lg text-foreground-muted">
            Каждая линейка — про текстуру, баланс вкуса и аккуратную подачу.
          </p>
        </div>
      </div>

      {n === 0 ? (
        <p className="text-sm text-foreground-muted">Категории скоро появятся.</p>
      ) : n === 1 ? (
        <div className="grid grid-cols-1">
          <CategoryTile
            cat={visibleCategories[0]}
            isActive={active === visibleCategories[0].filter_key}
            onSelect={() => onChange(visibleCategories[0].filter_key)}
            href={categoryHrefBuilder?.(visibleCategories[0].filter_key)}
            className="min-h-[360px] md:min-h-[420px]"
          />
        </div>
      ) : n === 2 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {visibleCategories.map((cat) => (
            <CategoryTile
              key={cat.filter_key}
              cat={cat}
              isActive={active === cat.filter_key}
              onSelect={() => onChange(cat.filter_key)}
              href={categoryHrefBuilder?.(cat.filter_key)}
              className="min-h-[320px]"
            />
          ))}
        </div>
      ) : (
        <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <CategoryTile
            cat={visibleCategories[0]}
            isActive={active === visibleCategories[0].filter_key}
            onSelect={() => onChange(visibleCategories[0].filter_key)}
            href={categoryHrefBuilder?.(visibleCategories[0].filter_key)}
            className="md:col-span-8 md:min-h-[340px]"
          />
          <CategoryTile
            cat={visibleCategories[1]}
            isActive={active === visibleCategories[1].filter_key}
            onSelect={() => onChange(visibleCategories[1].filter_key)}
            href={categoryHrefBuilder?.(visibleCategories[1].filter_key)}
            className="md:col-span-4 md:min-h-[340px]"
          />
          <CategoryTile
            cat={visibleCategories[2]}
            isActive={active === visibleCategories[2].filter_key}
            onSelect={() => onChange(visibleCategories[2].filter_key)}
            href={categoryHrefBuilder?.(visibleCategories[2].filter_key)}
            className="md:col-span-4 md:min-h-[280px]"
          />
          {n >= 4 ? (
            <CategoryTile
              cat={visibleCategories[3]}
              isActive={active === visibleCategories[3].filter_key}
              onSelect={() => onChange(visibleCategories[3].filter_key)}
              href={categoryHrefBuilder?.(visibleCategories[3].filter_key)}
              className="md:col-span-8 md:min-h-[280px]"
            />
          ) : (
            <FeaturedOriginPromo />
          )}
        </div>
      )}

      {n > 4 ? (
        <div className="flex flex-wrap gap-3 pt-2">
          {visibleCategories.slice(4).map((cat) => (
            <button
              key={cat.filter_key}
              type="button"
              onClick={() => onChange(cat.filter_key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active === cat.filter_key
                  ? "border-accent bg-accent-soft/40 text-primary-cocoa"
                  : "border-outline-variant/40 bg-muted-low text-foreground/85 hover:border-accent/40"
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
