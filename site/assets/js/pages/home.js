import { collectionPathForFilterKey } from "../collections-path.js";
import { initLayout } from "../layout.js";
import {
  DEFAULT_HOME_CATEGORIES,
  DEFAULT_HOME_SETTINGS,
  fetchHomePageCategories,
  fetchHomePageSettings,
  fetchProducts,
} from "../sheets.js";
import { renderShopByCategory } from "../shop-category.js";

function renderHero(settings) {
  const mount = document.getElementById("hero-mount");
  if (!mount) return;
  const img = settings.hero_image_url || "NEW/hero_bg.jpg";
  mount.innerHTML = `
<section class="relative isolate min-h-[100svh] w-full overflow-hidden bg-background">
  <img src="${img}" alt="" class="absolute inset-0 h-full w-full object-cover object-center" fetchpriority="high"/>
  <div class="absolute inset-0 bg-gradient-to-r from-primary-cocoa/70 via-primary-cocoa/45 to-transparent"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_30%,rgba(255,224,136,0.14),transparent_55%)]"></div>
  <div class="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-screen-2xl flex-col justify-center px-4 pb-16 pt-[calc(72px+2rem)] sm:px-6 lg:px-12">
    <div class="max-w-2xl">
      <h1 class="font-serif text-[2.35rem] font-normal leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.5rem]">${escapeAttr(settings.hero_heading)}</h1>
      <p class="mt-8 max-w-lg text-base leading-relaxed text-white/92 sm:text-lg md:text-xl">${escapeAttr(settings.hero_subheading)}</p>
      <div class="mt-10 flex flex-wrap gap-4">
        <a href="index.html#cat-%D0%9F%D0%B0%D1%81%D1%85%D0%B0" class="inline-flex min-w-[200px] items-center justify-center rounded-md bg-gradient-to-r from-primary-cocoa to-primary-container px-10 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_-20px_rgba(39,19,16,0.55)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_-18px_rgba(39,19,16,0.5)]">${escapeAttr(settings.hero_cta_primary)}</a>
        <a href="index.html#about" class="inline-flex min-w-[180px] items-center justify-center rounded-md border border-white/35 bg-white/5 px-10 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/12">${escapeAttr(settings.hero_cta_secondary || "О мастерской")}</a>
      </div>
    </div>
  </div>
</section>`;
}

function escapeAttr(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function main() {
  initLayout();

  let settings = { ...DEFAULT_HOME_SETTINGS };
  let homeCategories = DEFAULT_HOME_CATEGORIES.map((c) => ({ ...c }));
  let products = [];

  try {
    settings = await fetchHomePageSettings();
  } catch {
    /* defaults */
  }
  try {
    homeCategories = await fetchHomePageCategories();
  } catch {
    /* defaults */
  }
  try {
    products = await fetchProducts();
  } catch {
    products = [];
  }

  renderHero(settings);

  const catRoot = document.getElementById("home-categories-root");
  if (catRoot) {
    const hash = decodeURIComponent(
      window.location.hash.replace(/^#cat-/, ""),
    );
    const active = hash || "";
    const hrefFor = (key) => collectionPathForFilterKey(key);
    renderShopByCategory(
      catRoot,
      homeCategories,
      active,
      () => {},
      hrefFor,
      settings.categories_title,
    );
  }
}

main();
