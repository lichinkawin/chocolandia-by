import { escapeHtml, el } from "./dom.js";

function featuredOriginPromo() {
  return el(
    "div",
    "group relative flex min-h-[260px] overflow-hidden rounded-xl bg-primary-container md:col-span-8",
    {},
    `<div class="absolute right-5 top-5 z-10"><span class="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">Лимитированный выпуск</span></div>
    <div class="grid h-full min-h-[260px] w-full grid-cols-1 md:grid-cols-2">
      <div class="flex flex-col justify-center p-8 md:p-10">
        <h3 class="font-serif text-2xl text-white md:text-3xl">Одна плантация: Мадагаскар</h3>
        <p class="mt-3 text-sm leading-relaxed text-on-primary-container">Яркие ноты цитруса и ягод в балансе с глубоким землистым финалом. Сезонный урожай — в ограниченном количестве.</p>
        <a href="catalog.html" class="mt-6 w-fit border-b border-accent-highlight pb-1 text-sm font-bold text-accent-highlight transition hover:text-white">Смотреть в каталоге</a>
      </div>
      <div class="relative min-h-[200px] bg-gradient-to-br from-primary-container via-primary-cocoa to-primary-container">
        <div class="absolute inset-0 flex items-center justify-center p-6 text-center">
          <p class="font-serif text-sm italic text-white/70">[ фото какао-бобов ]</p>
        </div>
      </div>
    </div>`,
  );
}

/**
 * @param {object} cat
 * @param {boolean} isActive
 * @param {() => void} onSelect
 * @param {string | undefined} href
 * @param {string} [extraClass]
 */
function categoryTile(cat, isActive, onSelect, href, extraClass = "") {
  const ring = isActive
    ? "ring-2 ring-accent-highlight ring-offset-2 ring-offset-background"
    : "hover:ring-1 hover:ring-outline-variant/40";
  const hasImage = Boolean(cat.card_image_url);

  if (hasImage && cat.card_image_url) {
    const inner = `
      <img src="${escapeHtml(cat.card_image_url)}" alt="" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy"/>
      <div class="absolute inset-0 bg-gradient-to-t from-primary-cocoa/85 via-primary-cocoa/30 to-transparent opacity-90"></div>
      <div class="absolute bottom-8 left-8 right-8 text-white">
        <span class="mb-2 block text-[10px] font-bold uppercase tracking-[0.35em] text-accent-highlight">Коллекция</span>
        <h3 class="font-serif text-3xl leading-tight">${escapeHtml(cat.category_name)}</h3>
        ${cat.sub_label ? `<p class="mt-2 max-w-xs text-sm text-white/85">${escapeHtml(cat.sub_label)}</p>` : ""}
      </div>`;
    if (href) {
      const a = el(
        "a",
        `group relative flex min-h-[260px] w-full overflow-hidden rounded-xl text-left shadow-[0_20px_50px_-28px_rgba(39,19,16,0.35)] transition ${extraClass} ${ring}`,
        { href },
      );
      a.innerHTML = inner;
      return a;
    }
    const b = el(
      "button",
      `group relative flex min-h-[260px] w-full overflow-hidden rounded-xl text-left shadow-[0_20px_50px_-28px_rgba(39,19,16,0.35)] transition ${extraClass} ${ring}`,
      { type: "button" },
    );
    b.innerHTML = inner;
    b.addEventListener("click", onSelect);
    return b;
  }

  const letters = escapeHtml(cat.initial_letters.slice(0, 3));
  const circle = isActive
    ? "border-accent bg-accent-soft/50 text-primary-cocoa"
    : "border-outline-variant/50 bg-muted-low text-foreground/80";
  const inner = `
    <span class="flex h-16 w-16 items-center justify-center rounded-full border text-sm font-semibold ${circle}">${letters}</span>
    <h3 class="mt-4 font-serif text-xl text-primary-cocoa">${escapeHtml(cat.category_name)}</h3>
    ${cat.sub_label ? `<p class="mt-2 text-sm text-foreground-muted">${escapeHtml(cat.sub_label)}</p>` : ""}`;

  if (href) {
    const a = el(
      "a",
      `flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-card p-8 text-center shadow-[0_16px_40px_-24px_rgba(39,19,16,0.2)] transition ${extraClass} ${isActive ? "ring-2 ring-accent-highlight ring-offset-2 ring-offset-background" : "hover:shadow-[0_20px_50px_-22px_rgba(39,19,16,0.18)]"}`,
      { href },
    );
    a.innerHTML = inner;
    return a;
  }
  const b = el(
    "button",
    `flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-card p-8 text-center shadow-[0_16px_40px_-24px_rgba(39,19,16,0.2)] transition ${extraClass} ${isActive ? "ring-2 ring-accent-highlight ring-offset-2 ring-offset-background" : "hover:shadow-[0_20px_50px_-22px_rgba(39,19,16,0.18)]"}`,
    { type: "button" },
  );
  b.innerHTML = inner;
  b.addEventListener("click", onSelect);
  return b;
}

/**
 * @param {HTMLElement} container
 * @param {object[]} categories
 * @param {string} active
 * @param {(key: string) => void} onChange
 * @param {(filterKey: string) => string} [hrefFor]
 * @param {string} [title]
 */
export function renderShopByCategory(
  container,
  categories,
  active,
  onChange,
  hrefFor,
  title = "Коллекции",
) {
  container.innerHTML = "";
  const visible = categories.filter(
    (cat) =>
      cat.filter_key.trim().toLowerCase() !== "все" &&
      cat.category_name.trim().toLowerCase() !== "все",
  );
  const n = visible.length;

  const header = el("div", "flex flex-col justify-between gap-6 md:flex-row md:items-end");
  const titleSafe = escapeHtml(title.trim() || "Коллекции");
  header.innerHTML = `
    <div class="max-w-xl space-y-3">
      <h2 class="font-serif text-3xl leading-tight text-primary-cocoa md:text-4xl lg:text-5xl">${titleSafe}</h2>
      <p class="max-w-lg text-foreground-muted">Каждая линейка — про текстуру, баланс вкуса и аккуратную подачу.</p>
    </div>`;
  container.appendChild(header);

  if (n === 0) {
    container.appendChild(
      el("p", "text-sm text-foreground-muted", {}, "Категории скоро появятся."),
    );
    return;
  }

  const wrap = el("div", "mt-10 space-y-10");

  if (n === 1) {
    const g = el("div", "grid grid-cols-1");
    g.appendChild(
      categoryTile(
        visible[0],
        active === visible[0].filter_key,
        () => onChange(visible[0].filter_key),
        hrefFor?.(visible[0].filter_key),
        "min-h-[360px] md:min-h-[420px]",
      ),
    );
    wrap.appendChild(g);
  } else if (n === 2) {
    const g = el("div", "grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8");
    visible.forEach((cat) => {
      g.appendChild(
        categoryTile(
          cat,
          active === cat.filter_key,
          () => onChange(cat.filter_key),
          hrefFor?.(cat.filter_key),
          "min-h-[320px]",
        ),
      );
    });
    wrap.appendChild(g);
  } else {
    const g = el(
      "div",
      "grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-12 md:gap-8",
    );
    g.appendChild(
      categoryTile(
        visible[0],
        active === visible[0].filter_key,
        () => onChange(visible[0].filter_key),
        hrefFor?.(visible[0].filter_key),
        "md:col-span-8 md:min-h-[340px]",
      ),
    );
    g.appendChild(
      categoryTile(
        visible[1],
        active === visible[1].filter_key,
        () => onChange(visible[1].filter_key),
        hrefFor?.(visible[1].filter_key),
        "md:col-span-4 md:min-h-[340px]",
      ),
    );
    g.appendChild(
      categoryTile(
        visible[2],
        active === visible[2].filter_key,
        () => onChange(visible[2].filter_key),
        hrefFor?.(visible[2].filter_key),
        "md:col-span-4 md:min-h-[280px]",
      ),
    );
    if (n >= 4) {
      g.appendChild(
        categoryTile(
          visible[3],
          active === visible[3].filter_key,
          () => onChange(visible[3].filter_key),
          hrefFor?.(visible[3].filter_key),
          "md:col-span-8 md:min-h-[280px]",
        ),
      );
    } else {
      g.appendChild(featuredOriginPromo());
    }
    wrap.appendChild(g);
  }

  if (n > 4) {
    const pills = el("div", "flex flex-wrap gap-3 pt-2");
    visible.slice(4).forEach((cat) => {
      const b = el(
        "button",
        `rounded-full border px-4 py-2 text-sm font-medium transition ${
          active === cat.filter_key
            ? "border-accent bg-accent-soft/40 text-primary-cocoa"
            : "border-outline-variant/40 bg-muted-low text-foreground/85 hover:border-accent/40"
        }`,
        { type: "button" },
        escapeHtml(cat.category_name),
      );
      b.addEventListener("click", () => onChange(cat.filter_key));
      pills.appendChild(b);
    });
    wrap.appendChild(pills);
  }

  container.appendChild(wrap);
}
