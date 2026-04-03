import { initLayout } from "../layout.js";

const reviews = [
  { rating: 5, text: "Потрясающе вкусно и очень красиво. Всё выглядело как на фото, а упаковка просто восторг!", author: "Мария", date: "2026-02-14" },
  { rating: 5, text: "Сделали заказ к празднику — пришло вовремя, шоколад свежий, а оформление аккуратное до деталей.", author: "Александр", date: "2026-01-29" },
  { rating: 5, text: "Шикарный набор! Вкус насыщенный, а подача вызывает улыбку. Хочется заказывать снова.", author: "Екатерина", date: "2025-12-20" },
  { rating: 5, text: "Всё на высшем уровне: вкус, упаковка, внимательность к пожеланиям. Огромное спасибо за сервис!", author: "Ирина", date: "2025-11-08" },
  { rating: 5, text: "Рекомендую с уверенностью. Видно, что делаете с любовью: от оформления до качества шоколада.", author: "Дмитрий", date: "2025-10-03" },
  { rating: 5, text: "Очень удачный заказ: быстро согласовали детали, доставили оперативно, всё было упаковано премиально.", author: "Ольга", date: "2025-09-15" },
];

function starsHtml(n) {
  const x = Math.max(0, Math.min(5, Math.round(n)));
  let o = '<div class="flex items-center gap-1" aria-hidden="true">';
  for (let i = 0; i < 5; i += 1) {
    o +=
      i < x
        ? '<span class="text-accent">★</span>'
        : '<span class="text-border">☆</span>';
  }
  return `${o}</div>`;
}

function main() {
  initLayout();
  const scroller = document.getElementById("reviews-scroller");
  if (!scroller) return;
  scroller.innerHTML = reviews
    .map(
      (r) => `
    <div class="min-w-[320px] flex-1 shrink-0 snap-start sm:min-w-[360px] lg:min-w-[340px]" style="scroll-snap-align:start">
      <article class="h-full rounded-2xl border border-border/70 bg-card p-5 transition hover:border-accent/40">
        ${starsHtml(r.rating)}
        <p class="mt-3 text-sm leading-relaxed text-foreground-muted">${escapeHtml(r.text)}</p>
        <div class="mt-4 flex items-center justify-between gap-4">
          <p class="text-sm font-medium text-primary-cocoa">${escapeHtml(r.author)}</p>
          <p class="text-xs text-foreground-muted/80">${escapeHtml(r.date)}</p>
        </div>
      </article>
    </div>`,
    )
    .join("");

  const prev = document.getElementById("reviews-prev");
  const next = document.getElementById("reviews-next");
  prev?.addEventListener("click", () => {
    scroller.scrollBy({ left: -scroller.clientWidth, behavior: "smooth" });
  });
  next?.addEventListener("click", () => {
    scroller.scrollBy({ left: scroller.clientWidth, behavior: "smooth" });
  });
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

main();
