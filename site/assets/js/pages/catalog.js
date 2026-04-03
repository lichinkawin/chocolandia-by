import { renderProductGrid } from "../catalog-render.js";
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

  const catParam = getQueryParam("category");
  const validKeys = new Set(homeCategories.map((c) => c.filter_key));
  let activeFilter =
    catParam && validKeys.has(catParam) ? catParam : "Все";

  const shopRoot = document.getElementById("catalog-shop-root");
  const gridRoot = document.getElementById("catalog-grid-root");

  const hrefFor = (key) =>
    `catalog.html?category=${encodeURIComponent(key)}`;

  const rerenderShop = () => {
    if (!shopRoot) return;
    renderShopByCategory(
      shopRoot,
      homeCategories,
      activeFilter,
      (key) => {
        activeFilter = key;
        window.history.replaceState(
          null,
          "",
          key === "Все"
            ? "catalog.html"
            : `catalog.html?category=${encodeURIComponent(key)}`,
        );
        rerenderShop();
        rerenderGrid();
      },
      hrefFor,
      settings.categories_title,
    );
  };

  let showAll = false;
  const rerenderGrid = () => {
    if (!gridRoot) return;
    gridRoot.innerHTML = "";
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

  rerenderShop();
  rerenderGrid();
}

main();
