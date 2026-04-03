import { cartItemsCount, onCartChange } from "./cart.js";
import * as icons from "./icons.js";

function updateCartBadges() {
  const n = cartItemsCount();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    if (!(badge instanceof HTMLElement)) return;
    badge.textContent = n > 0 ? String(n) : "";
    badge.classList.toggle("hidden", n === 0);
  });
}

export function initLayout() {
  const navRoot = document.getElementById("site-nav");
  const footerRoot = document.getElementById("site-footer");
  if (!navRoot || !footerRoot) return;

  const p = window.location.pathname;
  const hideMobileCartFab =
    p.endsWith("product.html") ||
    /\/product\/[^/]+\/?$/.test(p) ||
    window.location.search.includes("slug=");

  navRoot.innerHTML = `
<header class="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/20 bg-background/88 shadow-[0_10px_40px_-18px_rgba(39,19,16,0.07)] backdrop-blur-xl">
  <div class="mx-auto flex h-[72px] w-full max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
    <div class="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:gap-8">
      <button type="button" id="nav-open-mobile" class="rounded-lg p-2 transition hover:bg-muted-low md:hidden" aria-label="Открыть меню">${icons.iconMenu("h-5 w-5 text-primary-cocoa")}</button>
      <a href="index.html" class="shrink-0 font-serif text-lg italic tracking-tight text-primary-cocoa sm:text-2xl md:text-[1.65rem]">CHOCOLANDIA.BY</a>
      <nav class="hidden items-center gap-8 lg:flex">
        <div class="relative" id="nav-catalog-wrap">
          <a href="catalog.html" id="nav-catalog-link" class="font-serif text-base tracking-tight text-primary-container transition hover:text-accent" aria-expanded="false" aria-haspopup="menu">Каталог</a>
          <div id="nav-catalog-dd" class="pointer-events-none absolute left-0 top-full z-50 min-w-[220px] -translate-y-1 pt-3 opacity-0 transition">
            <div class="rounded-xl border border-outline-variant/25 bg-card/95 p-2 shadow-[0_24px_60px_-20px_rgba(39,19,16,0.2)] backdrop-blur-lg">
              <a href="catalog.html?category=${encodeURIComponent("Пасха")}" class="block rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition hover:bg-muted-low hover:text-foreground">Пасха</a>
              <a href="catalog.html?category=${encodeURIComponent("Наборы")}" class="block rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition hover:bg-muted-low hover:text-foreground">Наборы</a>
              <a href="catalog.html?category=${encodeURIComponent("Клубника")}" class="block rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition hover:bg-muted-low hover:text-foreground">Клубника</a>
            </div>
          </div>
        </div>
        <a href="faq.html#reviews" class="font-serif text-base tracking-tight text-primary-container transition hover:text-accent">Отзывы</a>
        <a href="index.html#about" class="font-serif text-base tracking-tight text-primary-container transition hover:text-accent">О нас</a>
        <a href="contacts.html" class="font-serif text-base tracking-tight text-primary-container transition hover:text-accent">Контакты</a>
      </nav>
    </div>
    <div class="flex items-center gap-1 sm:gap-3">
      <a href="https://www.instagram.com/chocolandia.by/" target="_blank" rel="noreferrer noopener" class="hidden rounded-full border border-outline-variant/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-muted transition hover:border-accent/40 hover:bg-muted-low hover:text-foreground xl:inline-flex">Instagram</a>
      <a href="cart.html" class="group relative hidden h-11 w-11 items-center justify-center rounded-full border border-outline-variant/50 bg-card/70 shadow-[0_8px_32px_-12px_rgba(39,19,16,0.2)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-card hover:shadow-[0_14px_40px_-14px_rgba(39,19,16,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 md:inline-flex" aria-label="Перейти в корзину">
        ${icons.iconBag("h-5 w-5 text-primary-cocoa transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110")}
        <span data-cart-count class="absolute -right-1 -top-1 hidden min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white shadow-md ring-2 ring-background"></span>
      </a>
    </div>
  </div>
</header>
${hideMobileCartFab ? "" : `<a href="cart.html" class="group fixed bottom-6 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/50 bg-card/70 shadow-[0_8px_32px_-12px_rgba(39,19,16,0.2)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 md:hidden" aria-label="Перейти в корзину">
  ${icons.iconBag("h-5 w-5 text-primary-cocoa")}
  <span data-cart-count class="absolute -right-1 -top-1 hidden min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white shadow-md ring-2 ring-background"></span>
</a>`}
<div id="nav-mobile-overlay" class="pointer-events-none fixed inset-0 z-[60] transition">
  <button type="button" id="nav-close-scrim" class="absolute inset-0 bg-primary-cocoa/30 opacity-0 backdrop-blur-sm transition-opacity" aria-label="Закрыть меню"></button>
  <aside id="nav-mobile-panel" class="absolute right-0 top-0 flex h-full w-[86%] max-w-sm translate-x-full flex-col border-l border-outline-variant/30 bg-card/98 p-6 shadow-2xl backdrop-blur-xl transition-transform">
    <div class="mb-8 flex items-center justify-between">
      <p class="font-serif text-lg text-primary-cocoa">Меню</p>
      <button type="button" id="nav-close-btn" class="rounded-lg p-2 transition hover:bg-muted-low" aria-label="Закрыть меню">${icons.iconX()}</button>
    </div>
    <nav class="flex flex-1 flex-col gap-1 overflow-y-auto">
      <div class="space-y-1 pb-4">
        <p class="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">Каталог</p>
        <a href="catalog.html?category=${encodeURIComponent("Пасха")}" class="nav-mobile-link block rounded-lg px-3 py-2.5 font-serif text-foreground/90 transition hover:bg-muted-low">Пасха</a>
        <a href="catalog.html?category=${encodeURIComponent("Наборы")}" class="nav-mobile-link block rounded-lg px-3 py-2.5 font-serif text-foreground/90 transition hover:bg-muted-low">Наборы</a>
        <a href="catalog.html?category=${encodeURIComponent("Клубника")}" class="nav-mobile-link block rounded-lg px-3 py-2.5 font-serif text-foreground/90 transition hover:bg-muted-low">Клубника</a>
      </div>
      <a href="faq.html#reviews" class="nav-mobile-link rounded-lg px-3 py-2.5 font-serif text-foreground/90 transition hover:bg-muted-low">Отзывы</a>
      <a href="index.html#about" class="nav-mobile-link rounded-lg px-3 py-2.5 font-serif text-foreground/90 transition hover:bg-muted-low">О нас</a>
      <a href="contacts.html" class="nav-mobile-link rounded-lg px-3 py-2.5 font-serif text-foreground/90 transition hover:bg-muted-low">Контакты</a>
      <a href="https://www.instagram.com/chocolandia.by/" target="_blank" rel="noreferrer noopener" class="nav-mobile-link rounded-lg px-3 py-2.5 text-foreground/90 transition hover:bg-muted-low">Instagram</a>
      <a href="cart.html" class="nav-mobile-link mt-4 rounded-lg border border-outline-variant/40 px-3 py-3 text-center font-medium text-primary-cocoa transition hover:bg-muted-low">Корзина</a>
    </nav>
  </aside>
</div>`;

  footerRoot.innerHTML = `
<footer id="contacts" class="scroll-mt-24 bg-footer-dim text-foreground">
  <div class="mx-auto grid w-full max-w-screen-2xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-4 lg:gap-12 lg:px-12">
    <section class="space-y-6">
      <h3 class="font-serif text-xl uppercase tracking-[0.15em] text-primary-cocoa">Chocolandia.by</h3>
      <p class="text-sm leading-relaxed text-primary-container/85">Ручной бельгийский шоколад в Минске. Минимум шума — максимум вкуса и заботы о деталях.</p>
    </section>
    <section>
      <h4 class="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-cocoa">Навигация</h4>
      <ul class="space-y-3">
        <li><a href="catalog.html" class="text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent">Каталог</a></li>
        <li><a href="index.html#about" class="text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent">О нас</a></li>
        <li><a href="faq.html#reviews" class="text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent">Отзывы</a></li>
      </ul>
    </section>
    <section>
      <h4 class="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-cocoa">Поддержка</h4>
      <ul class="space-y-3">
        <li><a href="#" class="text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent">Способы оплаты и доставки</a></li>
        <li><a href="index.html#contacts" class="text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent">Контакты</a></li>
        <li><a href="#" class="text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent">Публичный договор (Оферта)</a></li>
      </ul>
      <a href="#" class="mt-4 inline-block text-sm uppercase tracking-wide text-primary-container/75 transition hover:text-accent">Образец чека</a>
    </section>
    <section class="space-y-5">
      <h4 class="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-cocoa">Реквизиты и связь</h4>
      <div class="space-y-4 text-sm leading-relaxed text-primary-container/85">
        <p>ИП / ООО [Название], УНП [Номер]</p>
        <p>Юридический адрес: [Адрес]</p>
        <p>Заказы и вопросы — в Telegram и по контактам на странице «Контакты».</p>
      </div>
    </section>
  </div>
  <div class="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 border-t border-primary-cocoa/10 px-4 py-10 sm:flex-row sm:px-6 lg:px-12">
    <p class="text-center text-[11px] uppercase tracking-[0.15em] text-primary-container/55 sm:text-left">© ${new Date().getFullYear()} Chocolandia.by · Минск</p>
    <div class="flex gap-8 text-[11px] font-bold uppercase tracking-[0.15em] text-primary-container/70">
      <a href="#" class="transition hover:text-accent">Конфиденциальность</a>
      <a href="#" class="transition hover:text-accent">Условия</a>
    </div>
  </div>
</footer>`;

  const mobileOpen = () => {
    const o = document.getElementById("nav-mobile-overlay");
    const p = document.getElementById("nav-mobile-panel");
    const s = document.getElementById("nav-close-scrim");
    o?.classList.remove("pointer-events-none");
    p?.classList.remove("translate-x-full");
    s?.classList.remove("opacity-0");
    s?.classList.add("opacity-100");
  };
  const mobileClose = () => {
    const o = document.getElementById("nav-mobile-overlay");
    const p = document.getElementById("nav-mobile-panel");
    const s = document.getElementById("nav-close-scrim");
    o?.classList.add("pointer-events-none");
    p?.classList.add("translate-x-full");
    s?.classList.add("opacity-0");
    s?.classList.remove("opacity-100");
  };

  document.getElementById("nav-open-mobile")?.addEventListener("click", mobileOpen);
  document.getElementById("nav-close-btn")?.addEventListener("click", mobileClose);
  document.getElementById("nav-close-scrim")?.addEventListener("click", mobileClose);
  document.querySelectorAll(".nav-mobile-link").forEach((a) => {
    a.addEventListener("click", mobileClose);
  });

  const wrap = document.getElementById("nav-catalog-wrap");
  const dd = document.getElementById("nav-catalog-dd");
  wrap?.addEventListener("mouseenter", () => {
    dd?.classList.remove("pointer-events-none", "-translate-y-1", "opacity-0");
    dd?.classList.add("translate-y-0", "opacity-100");
  });
  wrap?.addEventListener("mouseleave", () => {
    dd?.classList.add("pointer-events-none", "-translate-y-1", "opacity-0");
    dd?.classList.remove("translate-y-0", "opacity-100");
  });

  updateCartBadges();
  onCartChange(updateCartBadges);
}
