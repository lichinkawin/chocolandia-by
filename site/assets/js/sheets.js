import { getConfig } from "./config.js";
import { toFinalImagePath } from "./image.js";

const DEFAULT_PUB_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVtil-VxkkbMZK7nXEShlrD9trRJ1VvM2nmQg7KnIN17Y_J9GHt2ZzbEc40i8R8U94duRG9IM7Gj1Q/pub";
const DEFAULT_PRODUCTS_CSV_URL = `${DEFAULT_PUB_BASE}?output=csv`;

export const DEFAULT_HOME_SETTINGS = {
  hero_heading: "Искусство бельгийского шоколада",
  hero_subheading: "Ручная работа. Создаем моменты счастья в Минске.",
  hero_cta_primary: "Перейти в каталог",
  hero_cta_secondary: "О нас",
  brand_line: "Chocolandia.by · Минск",
  categories_eyebrow: "Shop by category",
  categories_title: "Выберите коллекцию",
};

export const DEFAULT_HOME_CATEGORIES = [
  {
    category_name: "Пасха",
    initial_letters: "Па",
    sub_label: "Сезон",
    filter_key: "Пасха",
  },
  {
    category_name: "Наборы",
    initial_letters: "На",
    sub_label: "Подарки",
    filter_key: "Наборы",
  },
  {
    category_name: "Клубника",
    initial_letters: "Кл",
    sub_label: "Фишка",
    filter_key: "Клубника",
  },
];

/** @param {string} line */
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
}

/** @param {string | undefined} value */
function toNumber(value) {
  if (!value) return 0;
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** @param {string} csvText */
function parseCsvToRecords(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    /** @type {Record<string, string>} */
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
}

function buildPubCsvUrlByGid(gid) {
  return `${DEFAULT_PUB_BASE}?gid=${encodeURIComponent(gid)}&single=true&output=csv`;
}

function getHomeSettingsCsvUrl() {
  const c = getConfig();
  if (c.homeSettingsCsvUrl?.trim()) return c.homeSettingsCsvUrl.trim();
  return null;
}

function getHomeCategoriesCsvUrl() {
  const c = getConfig();
  if (c.homeCategoriesCsvUrl?.trim()) return c.homeCategoriesCsvUrl.trim();
  return null;
}

/** @param {Record<string, string>} row */
function mapSettingsRow(row) {
  const heroImageRaw = row.hero_image_url?.trim();
  return {
    hero_heading: row.hero_heading?.trim() || DEFAULT_HOME_SETTINGS.hero_heading,
    hero_subheading:
      row.hero_subheading?.trim() || DEFAULT_HOME_SETTINGS.hero_subheading,
    hero_cta_primary:
      row.hero_cta_primary?.trim() || DEFAULT_HOME_SETTINGS.hero_cta_primary,
    hero_cta_secondary:
      row.hero_cta_secondary?.trim() || DEFAULT_HOME_SETTINGS.hero_cta_secondary,
    hero_image_url: heroImageRaw ? toFinalImagePath(heroImageRaw) : undefined,
    brand_line: row.brand_line?.trim() || DEFAULT_HOME_SETTINGS.brand_line,
    categories_eyebrow:
      row.categories_eyebrow?.trim() || DEFAULT_HOME_SETTINGS.categories_eyebrow,
    categories_title:
      row.categories_title?.trim() || DEFAULT_HOME_SETTINGS.categories_title,
  };
}

/** @param {Record<string, string>} row */
function mapCategoryRow(row) {
  const name = row.category_name?.trim();
  if (!name) return null;
  const filterKey =
    row.filter_key?.trim() || row.category_filter?.trim() || name;
  const cardRaw = row.card_image_url?.trim();
  return {
    category_name: name,
    initial_letters: row.initial_letters?.trim() || name.slice(0, 2),
    sub_label: row.sub_label?.trim() || "",
    filter_key: filterKey,
    card_image_url: cardRaw ? toFinalImagePath(cardRaw) : undefined,
  };
}

/** @param {string} url */
async function fetchCsvText(url) {
  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) throw new Error(`CSV fetch failed: ${response.status}`);
  return response.text();
}

export async function fetchHomePageSettings() {
  const url = getHomeSettingsCsvUrl();
  if (!url) return { ...DEFAULT_HOME_SETTINGS };
  try {
    const text = await fetchCsvText(url);
    const rows = parseCsvToRecords(text);
    if (!rows.length) return { ...DEFAULT_HOME_SETTINGS };
    return mapSettingsRow(rows[0]);
  } catch {
    return { ...DEFAULT_HOME_SETTINGS };
  }
}

export async function fetchHomePageCategories() {
  const url = getHomeCategoriesCsvUrl();
  if (!url) return DEFAULT_HOME_CATEGORIES.map((c) => ({ ...c }));
  try {
    const text = await fetchCsvText(url);
    const rows = parseCsvToRecords(text);
    const mapped = rows.map(mapCategoryRow).filter(Boolean);
    return mapped.length ? mapped : DEFAULT_HOME_CATEGORIES.map((c) => ({ ...c }));
  } catch {
    return DEFAULT_HOME_CATEGORIES.map((c) => ({ ...c }));
  }
}

/** @param {Record<string, string>} raw */
function mapRawProduct(raw) {
  return {
    id: raw.id?.trim() || "",
    code: raw.code?.trim() || "",
    name: raw.name?.trim() || "Без названия",
    price: toNumber(raw.price),
    category: raw.category?.trim() || "Без категории",
    description: raw.description?.trim() || "",
    composition: raw.composition?.trim() || "",
    slug: raw.slug?.trim() || "",
    imageUrl: toFinalImagePath(raw.image_url),
    imageHoverUrl: raw.image_hover_url
      ? toFinalImagePath(raw.image_hover_url)
      : undefined,
  };
}

/** @param {string} text */
export function parseProductsCsvText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    /** @type {Record<string, string>} */
    const raw = {};
    headers.forEach((header, index) => {
      raw[header] = values[index] ?? "";
    });
    return mapRawProduct(raw);
  });
}

export async function fetchProducts() {
  const c = getConfig();
  if (c.productsBundledUrl?.trim()) {
    try {
      const response = await fetch(c.productsBundledUrl.trim(), {
        cache: "no-store",
      });
      if (response.ok) {
        const text = await response.text();
        return parseProductsCsvText(text);
      }
    } catch {
      /* try remote */
    }
  }
  const csvUrl = (c.productsCsvUrl || DEFAULT_PRODUCTS_CSV_URL).trim();
  const response = await fetch(csvUrl, { mode: "cors" });
  if (!response.ok) throw new Error(`Failed to load CSV: ${response.status}`);
  const text = await response.text();
  return parseProductsCsvText(text);
}

