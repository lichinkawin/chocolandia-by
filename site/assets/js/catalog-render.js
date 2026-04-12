import { addItem, getCartItems } from "./cart.js";
import { escapeHtml, el } from "./dom.js";
import { formatBynPrice } from "./price.js";

/** @param {number} index */
function badgeForIndex(index) {
  if (index % 5 === 0) return "Лимит";
  if (index % 5 === 2) return "Хит";
  return undefined;
}

/**
 * @param {HTMLImageElement} img
 * @param {string} src
 * @param {string} alt
 */
function bindProductImage(img, src, alt) {
  img.src = src;
  img.alt = alt;
  img.className =
    "absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.05]";
  img.loading = "lazy";
  img.onerror = () => {
    img.replaceWith(
      el(
        "div",
        "absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-muted text-center",
        {},
        `<span class="absolute -rotate-12 text-4xl font-serif text-border/70">C</span><span class="font-serif text-lg tracking-wide text-primary-container/80">Chocolandia</span>`,
      ),
    );
  };
}

/**
 * @param {import('./sheets.js').Product} product
 * @param {number} index
 */
export function createProductCard(product, index) {
  const qty =
    getCartItems().find((i) => i.id === product.id)?.quantity ?? 0;
  const badge = badgeForIndex(index);

  const slugForUrl = (product.slug || product.code || product.id || "").trim();
  const wrap = el("a", "group block", {
    href: slugForUrl
      ? `product.html?slug=${encodeURIComponent(slugForUrl)}`
      : "catalog.html",
  });

  const article = el(
    "article",
    "flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-[0_12px_40px_-18px_rgba(30,27,19,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-20px_rgba(39,19,16,0.16)]",
  );

  const imgWrap = el(
    "div",
    "relative aspect-[4/5] overflow-hidden bg-muted",
  );
  if (badge) {
    imgWrap.appendChild(
      el(
        "span",
        "absolute left-3 top-3 z-10 rounded-sm bg-secondary-container px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container shadow-sm",
        {},
        escapeHtml(badge),
      ),
    );
  }
  const img = document.createElement("img");
  bindProductImage(img, product.imageUrl, product.name);
  imgWrap.appendChild(img);

  const body = el("div", "flex flex-1 flex-col gap-3 p-5");
  body.appendChild(
    el(
      "p",
      "text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground-muted",
      {},
      escapeHtml(product.category),
    ),
  );
  body.appendChild(
    el(
      "h3",
      "line-clamp-2 font-serif text-lg leading-snug text-primary-cocoa",
      {},
      escapeHtml(product.name),
    ),
  );
  body.appendChild(
    el(
      "p",
      "mt-auto font-serif text-xl font-medium tracking-tight text-primary-cocoa",
      {},
      escapeHtml(formatBynPrice(product.price)),
    ),
  );

  const btn = el(
    "button",
    `w-full rounded-md border py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition duration-200 active:scale-[0.98] border-outline-variant/50 bg-muted-low text-foreground hover:border-accent/40 hover:bg-card`,
    { type: "button" },
  );
  const setBtn = () => {
    const q =
      getCartItems().find((i) => i.id === product.id)?.quantity ?? 0;
    if (btn.dataset.added === "1") {
      btn.className =
        "w-full rounded-md border py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition duration-200 active:scale-[0.98] border-accent bg-accent text-white shadow-sm";
      btn.textContent = "Добавлено ✓";
      return;
    }
    btn.className =
      "w-full rounded-md border py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition duration-200 active:scale-[0.98] border-outline-variant/50 bg-muted-low text-foreground hover:border-accent/40 hover:bg-card";
    btn.textContent =
      q > 0 ? `В корзине · ${q}` : "В корзину →";
  };
  setBtn();
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    btn.dataset.added = "1";
    setBtn();
    window.setTimeout(() => {
      delete btn.dataset.added;
      setBtn();
    }, 900);
  });
  window.addEventListener("chocolandia-cart", setBtn);
  body.appendChild(btn);

  article.appendChild(imgWrap);
  article.appendChild(body);
  wrap.appendChild(article);
  return wrap;
}

/**
 * @param {HTMLElement} container
 * @param {import('./sheets.js').Product[]} products
 * @param {string} activeFilter
 * @param {boolean} showAll
 * @param {(v: boolean) => void} onToggleShowAll
 */
export function renderProductGrid(
  container,
  products,
  activeFilter,
  showAll,
  onToggleShowAll,
) {
  container.innerHTML = "";
  const filtered =
    activeFilter === "Все"
      ? products
      : products.filter((p) => p.category === activeFilter);
  const visibleLimit = 9;
  const visible = showAll
    ? filtered
    : filtered.slice(0, visibleLimit);

  if (!filtered.length) {
    container.appendChild(
      el(
        "p",
        "rounded-xl bg-muted-low/90 py-20 text-center text-sm text-foreground-muted",
        {},
        "В этой категории пока нет товаров.",
      ),
    );
    return;
  }

  const grid = el(
    "div",
    "grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 2xl:grid-cols-4",
  );
  visible.forEach((p, i) => grid.appendChild(createProductCard(p, i)));
  container.appendChild(grid);

  if (filtered.length > visibleLimit) {
    const wrap = el("div", "pt-4 text-center");
    const btn = el(
      "button",
      "inline-flex items-center justify-center rounded-md border border-outline-variant/50 bg-muted-low px-8 py-3 text-sm font-semibold text-primary-cocoa transition hover:border-accent/45 hover:bg-card",
      { type: "button" },
      showAll ? "Скрыть" : "Показать больше",
    );
    btn.addEventListener("click", () => onToggleShowAll(!showAll));
    wrap.appendChild(btn);
    container.appendChild(wrap);
  }
}
