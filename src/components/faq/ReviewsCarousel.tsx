"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";

export type ReviewItem = {
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  author: string;
  date: string;
};

function Stars({ rating }: { rating: number }) {
  const normalized = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < normalized;
        return (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={isFilled ? "text-accent" : "text-border"}
            aria-hidden="true"
          >
            {isFilled ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
}

const scrollerCardStyle: CSSProperties = {
  scrollSnapAlign: "start",
};

export function ReviewsCarousel({ reviews }: { reviews: ReviewItem[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByViewport = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <button
          type="button"
          onClick={() => scrollByViewport(-1)}
          aria-label="Предыдущие отзывы"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/80 text-primary-cocoa shadow-sm backdrop-blur sm:inline-flex"
        >
          ‹
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {reviews.map((r, idx) => (
          <div
            key={`${r.author}-${r.date}-${idx}`}
            style={scrollerCardStyle}
            className="min-w-[320px] flex-1 shrink-0 snap-start sm:min-w-[360px] lg:min-w-[340px]"
          >
            <article className="h-full rounded-2xl border border-border/70 bg-card p-5 transition hover:border-accent/40">
              <Stars rating={r.rating} />
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                {r.text}
              </p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-primary-cocoa">
                  {r.author}
                </p>
                <p className="text-xs text-foreground-muted/80">{r.date}</p>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
        <button
          type="button"
          onClick={() => scrollByViewport(1)}
          aria-label="Следующие отзывы"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/80 text-primary-cocoa shadow-sm backdrop-blur sm:inline-flex"
        >
          ›
        </button>
      </div>
    </div>
  );
}

