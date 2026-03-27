import { toPublicImagePath } from "@/lib/image";
import type {
  HomePageCategory,
  HomePageSettings,
} from "@/types/home";
import type { Product, ProductRaw } from "@/types/product";

const GOOGLE_SHEETS_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const DEFAULT_PUB_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVtil-VxkkbMZK7nXEShlrD9trRJ1VvM2nmQg7KnIN17Y_J9GHt2ZzbEc40i8R8U94duRG9IM7Gj1Q/pub";
const DEFAULT_PRODUCTS_CSV_URL = `${DEFAULT_PUB_BASE}?output=csv`;

/** Short revalidation for homepage CMS-like content */
const HOME_FETCH_OPTIONS: RequestInit = {
  next: { revalidate: 60, tags: ["homepage"] },
};

const PRODUCTS_FETCH_OPTIONS: RequestInit = {
  next: { revalidate: 60, tags: ["products"] },
};

type GoogleSheetResponse = {
  values?: string[][];
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
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

function toNumber(value?: string): number {
  if (!value) return 0;
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toFinalImagePath(value?: string): string {
  const normalized = toPublicImagePath(value);
  const parts = normalized.split("/");
  const fileName = (parts.at(-1) ?? "placeholder.jpg").toLowerCase();
  return `/NEW/${fileName}`;
}

function buildPubCsvUrlByGid(gid: string): string {
  return `${DEFAULT_PUB_BASE}?gid=${encodeURIComponent(gid)}&single=true&output=csv`;
}

function getHomeSettingsCsvUrl(): string | null {
  const direct = process.env.GOOGLE_SHEET_HOME_SETTINGS_CSV_URL?.trim();
  if (direct) return direct;
  const gid = process.env.GOOGLE_SHEET_HOME_SETTINGS_GID?.trim();
  if (gid) return buildPubCsvUrlByGid(gid);
  return null;
}

function getHomeCategoriesCsvUrl(): string | null {
  const direct = process.env.GOOGLE_SHEET_HOME_CATEGORIES_CSV_URL?.trim();
  if (direct) return direct;
  const gid = process.env.GOOGLE_SHEET_HOME_CATEGORIES_GID?.trim();
  if (gid) return buildPubCsvUrlByGid(gid);
  return null;
}

function parseCsvToRecords(csvText: string): Record<string, string>[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });
}

async function fetchCsvText(url: string, options: RequestInit): Promise<string> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`CSV fetch failed: ${response.status}`);
  }
  return response.text();
}

export const DEFAULT_HOME_SETTINGS: HomePageSettings = {
  hero_heading: "Искусство бельгийского шоколада",
  hero_subheading: "Ручная работа. Создаем моменты счастья в Минске.",
  hero_cta_primary: "Перейти в каталог",
  hero_cta_secondary: "О нас",
  brand_line: "Chocolandia.by · Минск",
  categories_eyebrow: "Shop by category",
  categories_title: "Выберите коллекцию",
};

export const DEFAULT_HOME_CATEGORIES: HomePageCategory[] = [
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

function mapSettingsRow(row: Record<string, string>): HomePageSettings {
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

function mapCategoryRow(row: Record<string, string>): HomePageCategory | null {
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

/**
 * Single-row settings from tab "HomePage_Settings".
 */
export async function fetchHomePageSettings(): Promise<HomePageSettings> {
  const url = getHomeSettingsCsvUrl();
  if (!url) {
    return DEFAULT_HOME_SETTINGS;
  }

  try {
    const text = await fetchCsvText(url, HOME_FETCH_OPTIONS);
    const rows = parseCsvToRecords(text);
    if (!rows.length) return DEFAULT_HOME_SETTINGS;
    return mapSettingsRow(rows[0]);
  } catch {
    return DEFAULT_HOME_SETTINGS;
  }
}

/**
 * Rows from tab "HomePage_Categories".
 */
export async function fetchHomePageCategories(): Promise<HomePageCategory[]> {
  const url = getHomeCategoriesCsvUrl();
  if (!url) {
    return DEFAULT_HOME_CATEGORIES;
  }

  try {
    const text = await fetchCsvText(url, HOME_FETCH_OPTIONS);
    const rows = parseCsvToRecords(text);
    const mapped = rows
      .map(mapCategoryRow)
      .filter((c): c is HomePageCategory => c !== null);
    return mapped.length ? mapped : DEFAULT_HOME_CATEGORIES;
  } catch {
    return DEFAULT_HOME_CATEGORIES;
  }
}

function mapRawProduct(raw: ProductRaw): Product {
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

export async function fetchProductsFromCsv(
  csvUrl = process.env.GOOGLE_SHEET_CSV_URL || DEFAULT_PRODUCTS_CSV_URL,
): Promise<Product[]> {
  const response = await fetch(csvUrl, PRODUCTS_FETCH_OPTIONS);

  if (!response.ok) {
    throw new Error(`Failed to load CSV: ${response.status}`);
  }

  const text = await response.text();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const raw: ProductRaw = {};

    headers.forEach((header, index) => {
      raw[header as keyof ProductRaw] = values[index] ?? "";
    });

    return mapRawProduct(raw);
  });
}

export async function fetchProductsFromGoogleApi(
  spreadsheetId = process.env.GOOGLE_SHEET_ID,
  range = process.env.GOOGLE_SHEET_RANGE || "products!A:I",
  apiKey = process.env.GOOGLE_SHEETS_API_KEY,
): Promise<Product[]> {
  if (!spreadsheetId || !apiKey) {
    throw new Error("GOOGLE_SHEET_ID or GOOGLE_SHEETS_API_KEY is not set.");
  }

  const url = new URL(
    `${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}/values/${encodeURIComponent(range)}`,
  );
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), PRODUCTS_FETCH_OPTIONS);

  if (!response.ok) {
    throw new Error(`Failed to load Google Sheet API data: ${response.status}`);
  }

  const data = (await response.json()) as GoogleSheetResponse;
  const rows = data.values ?? [];
  if (rows.length <= 1) return [];

  const headers = rows[0].map((header) => header.toLowerCase());

  return rows.slice(1).map((row) => {
    const raw: ProductRaw = {};
    headers.forEach((header, index) => {
      raw[header as keyof ProductRaw] = row[index] ?? "";
    });
    return mapRawProduct(raw);
  });
}

export async function fetchProducts(): Promise<Product[]> {
  if (process.env.GOOGLE_SHEET_CSV_URL || DEFAULT_PRODUCTS_CSV_URL) {
    return fetchProductsFromCsv();
  }

  return fetchProductsFromGoogleApi();
}
