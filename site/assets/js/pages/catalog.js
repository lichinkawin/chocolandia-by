import { renderProductGrid } from "../catalog-render.js";
import {
  collectionPathForFilterKey,
  getCollectionSlugFromUrl,
  resolveCollectionFilterKey,
} from "../collections-path.js";
import { escapeHtml } from "../dom.js";
import { initLayout } from "../layout.js";
import {
  DEFAULT_HOME_CATEGORIES,
  DEFAULT_HOME_SETTINGS,
  fetchHomePageCategories,
  fetchHomePageSettings,
  fetchProducts,
} from "../sheets.js";
import { renderShopByCategory } from "../shop-category.js";

function getQueryParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name) || "";
}

/**
 * Кандидаты slug из path/hash/query (важно для `?category=` на проде при кэше старого collections-path).
 * @returns {string[]}
 */
function getCandidateCollectionSlugs() {
  const fromPath = getCollectionSlugFromUrl();
  const qCat = getQueryParam("category");
  const qSlug = getQueryParam("slug");
  const qCol = getQueryParam("collection");
  /** @type {string[]} */
  const out = [];
  const seen = new Set();
  for (const x of [fromPath, qCat, qSlug, qCol]) {
    const t = (x || "").trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

/**
 * @returns {string | null} filter_key коллекции или null
 */
function getResolvedCollectionFilterKey(homeCategories) {
  for (const cand of getCandidateCollectionSlugs()) {
    const k = resolveCollectionFilterKey(cand, homeCategories);
    if (k && k.toLowerCase() !== "все") return k;
  }
  return null;
}

function isCollectionDetailView(homeCategories) {
  return getResolvedCollectionFilterKey(homeCategories) !== null;
}

async function main() {
  initLayout();

  let homeCategories = DEFAULT_HOME_CATEGORIES.map((c) => ({ ...c }));
  let settings = { ...DEFAULT_HOME_SETTINGS };
  let products = [];
  try {
    settings = await fetchHomePageSettings();
  } catch {
    /* */
  }
  try {
    homeCategories = await fetchHomePageCategories();
  } catch {
    /* */
  }
  try {
    products = await fetchProducts();
  } catch {
    products = [];
  }

  const validKeys = new Set(homeCategories.map((c) => c.filter_key));

  const qCat = getQueryParam("category");
  if (qCat && !window.location.pathname.includes("/collections/")) {
    const r = resolveCollectionFilterKey(qCat, homeCategories);
    if (r && r.toLowerCase() !== "все") {
      const u = new URL(window.location.href);
      u.hash = `col=${encodeURIComponent(r)}`;
      window.history.replaceState(null, "", u.pathname + u.search + u.hash);
    }
  }

  const resolvedKey = getResolvedCollectionFilterKey(homeCategories);
  const hadCategoryIntent = getCandidateCollectionSlugs().length > 0;

  const shopRoot = document.getElementById("catalog-shop-root");
  const gridRoot = document.getElementById("catalog-grid-root");
  const topLink = document.getElementById("catalog-top-link");
  const gridIntro = document.getElementById("catalog-grid-intro");

  if (hadCategoryIntent && !resolvedKey) {
    if (shopRoot) {
      shopRoot.innerHTML = `
      <div class="mx-auto max-w-lg rounded-xl border border-outline-variant/30 bg-muted-low/50 px-6 py-10 text-center">
        <p class="font-serif text-xl text-primary-cocoa">Коллекция не найдена</p>
        <p class="mt-2 text-sm text-foreground-muted">Проверьте ссылку или вернитесь в каталог.</p>
        <p class="mt-6"><a href="catalog.html" class="inline-flex rounded-md border border-accent/40 bg-card px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent-soft/30">Назад ко всем коллекциям</a></p>
      </div>`;
    }
    if (gridRoot) gridRoot.innerHTML = "";
    topLink?.classList.add("hidden");
    gridIntro?.classList.add("hidden");
    return;
  }

  let activeFilter = resolvedKey || "Все";
  if (!resolvedKey && qCat && validKeys.has(qCat)) {
    activeFilter = qCat;
  }

  const hrefFor = (key) => collectionPathForFilterKey(key);

  /**
   * @param {string} filterKey
   */
  function renderCategoryPageHeader(filterKey) {
    if (!shopRoot) return;
    const row = homeCategories.find((c) => c.filter_key === filterKey);
    const title = escapeHtml(row?.category_name || filterKey);
    const sub = row?.sub_label?.trim();
    const subHtml = sub
      ? `<p class="text-sm text-foreground-muted">${escapeHtml(sub)}</p>`
      : "";
    shopRoot.innerHTML = `
      <div class="mx-auto max-w-2xl space-y-4 pb-2 text-center md:space-y-5">
        <p class="text-[11px] font-bold uppercase tracking-[0.35em] text-foreground-muted">Коллекция</p>
        <h1 class="font-serif text-3xl text-primary-cocoa sm:text-4xl">${title}</h1>
        ${subHtml}
        <p class="pt-1"><a href="catalog.html" class="text-sm font-medium text-accent transition hover:text-primary-cocoa">Назад ко всем коллекциям</a></p>
      </div>`;
    const name = row?.category_name || filterKey;
    document.title = `${name} — Chocolandia.by`;
  }

  const rerenderShop = () => {
    if (!shopRoot) return;
    const detail = isCollectionDetailView(homeCategories);
    if (detail) {
      topLink?.classList.add("hidden");
      gridIntro?.classList.add("hidden");
      const fk = getResolvedCollectionFilterKey(homeCategories);
      if (fk) {
        activeFilter = fk;
        renderCategoryPageHeader(fk);
      }
      return;
    }
    topLink?.classList.remove("hidden");
    gridIntro?.classList.remove("hidden");
    document.title = "Каталог — Chocolandia.by";
    renderShopByCategory(
      shopRoot,
      homeCategories,
      activeFilter,
      (key) => {
        activeFilter = key;
        const u = new URL(window.location.href);
        if (key === "Все") {
          u.hash = "";
        } else {
          u.hash = `col=${encodeURIComponent(key)}`;
        }
        window.history.replaceState(null, "", u.pathname + u.search + u.hash);
        rerenderShop();
        rerenderGrid();
      },
      hrefFor,
      settings.categories_title,
    );
  };

  const showAllInitial = isCollectionDetailView(homeCategories);
  let showAll = showAllInitial;

  const rerenderGrid = () => {
    if (!gridRoot) return;
    gridRoot.innerHTML = "";
    const detail = isCollectionDetailView(homeCategories);
    if (detail && !showAll) showAll = true;
    renderProductGrid(
      gridRoot,
      products,
      activeFilter,
      showAll,
      (v) => {
        showAll = v;
        rerenderGrid();
      },
    );
  };

  const syncFromUrl = () => {
    const fk = getResolvedCollectionFilterKey(homeCategories);
    activeFilter = fk || "Все";
    rerenderShop();
    rerenderGrid();
  };

  window.addEventListener("popstate", syncFromUrl);
  window.addEventListener("hashchange", syncFromUrl);

  rerenderShop();
  rerenderGrid();
}

main();
