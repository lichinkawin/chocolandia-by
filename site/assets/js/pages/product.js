import { addItem } from "../cart.js";
import { initLayout } from "../layout.js";
import { fetchProducts } from "../sheets.js";
import { formatBynPrice } from "../price.js";
import { el } from "../dom.js";

function getSlug() {
  const u = new URL(window.location.href);
  return u.searchParams.get("slug")?.trim() || "";
}

async function main() {
  initLayout();
  const slug = getSlug();
  const mount = document.getElementById("product-root");
  if (!mount) return;

  let products = [];
  try {
    products = await fetchProducts();
  } catch {
    mount.innerHTML =
      '<p class="text-center text-foreground-muted">Не удалось загрузить каталог.</p>';
    return;
  }

  const product = products.find((p) => p.slug === slug);
  if (!product) {
    mount.innerHTML = `<div class="space-y-4 text-center py-16">
      <p class="text-foreground-muted">Товар не найден.</p>
      <a href="catalog.html" class="text-accent font-semibold hover:underline">Перейти в каталог</a>
    </div>`;
    document.title = "Товар не найден | Chocolandia.by";
    return;
  }

  document.title = `${product.name} | Chocolandia.by`;

  let quantity = 1;
  let feedbackTimer = 0;

  const wrap = el("div", "space-y-10");
  wrap.innerHTML = `
<nav class="text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground-muted">
  <a href="catalog.html" class="transition hover:text-foreground">Каталог</a>
  <span class="mx-2 text-foreground-muted/60">/</span>
  <span class="text-foreground/80">${escape(product.category)}</span>
  <span class="mx-2 text-foreground-muted/60">/</span>
  <span class="text-foreground">${escape(product.name)}</span>
</nav>
<section class="grid gap-12 lg:grid-cols-2 lg:gap-16">
  <div class="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-[0_24px_60px_-30px_rgba(39,19,16,0.25)]">
    <img id="product-hero-img" src="${escape(product.imageUrl)}" alt="${escape(product.name)}" class="h-full w-full object-cover"/>
  </div>
  <div class="flex flex-col gap-8">
    <div>
      <span class="inline-block rounded-sm bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">Авторская коллекция</span>
      <h1 class="mt-4 font-serif text-4xl leading-tight text-primary-cocoa sm:text-5xl">${escape(product.name)}</h1>
      <p class="mt-4 font-serif text-2xl text-primary-container">${escape(formatBynPrice(product.price))}</p>
    </div>
    ${product.description ? `<div class="space-y-2"><h2 class="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Вкусовой профиль</h2><p class="text-sm leading-relaxed text-foreground-muted">${escape(product.description)}</p></div>` : ""}
    ${product.composition ? `<div class="space-y-2"><h2 class="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Состав</h2><p class="text-sm italic leading-relaxed text-foreground-muted">${escape(product.composition)}</p></div>` : ""}
    <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">В наличии · готовы к отправке</p>
    <div id="product-add-panel" class="fixed bottom-0 left-0 right-0 z-30 border-t border-outline-variant/40 bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-12px_rgba(39,19,16,0.12)] backdrop-blur-lg lg:static lg:z-auto lg:border-0 lg:bg-muted-low/60 lg:p-5 lg:pb-5 lg:shadow-none lg:backdrop-blur-none rounded-t-xl lg:rounded-xl">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end" id="product-add-inner"></div>
    </div>
    <div class="hidden flex-wrap gap-8 border-t border-outline-variant/30 pt-8 sm:flex">
      <div><p class="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">Доставка</p><p class="mt-1 text-sm text-foreground">По Минску — по согласованию</p></div>
      <div><p class="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">Качество</p><p class="mt-1 text-sm text-foreground">Ручная работа, бельгийское сырьё</p></div>
    </div>
  </div>
</section>
<div class="border-t border-outline-variant/25 pt-8 lg:pt-10">
  <a href="catalog.html#catalog-section" class="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-primary-cocoa">← Вернуться в каталог</a>
</div>`;

  mount.appendChild(wrap);

  const img = document.getElementById("product-hero-img");
  if (img)
    img.addEventListener("error", () => {
      img.replaceWith(
        el(
          "div",
          "flex h-full min-h-[320px] flex-col items-center justify-center bg-muted p-8 text-center",
          {},
          '<span class="font-serif text-lg text-primary-container/80">Chocolandia</span>',
        ),
      );
    });

  const inner = document.getElementById("product-add-inner");
  if (!inner) return;

  const stepper = el("div", "inline-flex items-center rounded-md border border-outline-variant/50 bg-muted-low");
  const bMinus = el("button", "px-4 py-3 text-sm transition hover:bg-muted", { type: "button" }, "−");
  const qtySpan = el("span", "min-w-12 text-center text-sm font-medium", {}, "1");
  const bPlus = el("button", "px-4 py-3 text-sm transition hover:bg-muted", { type: "button" }, "+");
  const addBtn = el(
    "button",
    "flex-1 rounded-md bg-gradient-to-r from-primary-cocoa to-primary-container px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_16px_40px_-16px_rgba(39,19,16,0.45)] transition duration-200 active:scale-[0.99] hover:opacity-95",
    { type: "button" },
  );

  function syncQty() {
    qtySpan.textContent = String(quantity);
    addBtn.textContent = `В корзину · ${formatBynPrice(product.price * quantity)}`;
  }
  bMinus.addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    syncQty();
  });
  bPlus.addEventListener("click", () => {
    quantity += 1;
    syncQty();
  });
  addBtn.addEventListener("click", () => {
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
    addBtn.textContent = "Добавлено ✓";
    addBtn.className =
      "flex-1 rounded-md bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-md ring-2 ring-accent/30 transition duration-200";
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      addBtn.className =
        "flex-1 rounded-md bg-gradient-to-r from-primary-cocoa to-primary-container px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_16px_40px_-16px_rgba(39,19,16,0.45)] transition duration-200 active:scale-[0.99] hover:opacity-95";
      syncQty();
    }, 900);
  });

  stepper.appendChild(bMinus);
  stepper.appendChild(qtySpan);
  stepper.appendChild(bPlus);
  inner.appendChild(stepper);
  inner.appendChild(addBtn);
  syncQty();
}

function escape(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

main();
