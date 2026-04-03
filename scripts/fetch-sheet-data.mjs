/**
 * Optional: if Google Sheets CSV is blocked by CORS in the browser,
 * run: node scripts/fetch-sheet-data.mjs
 * Then set window.__CHOCOLANDIA_CONFIG__.productsDataUrl = "data/products.json" in HTML.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "site", "data");
const DEFAULT_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVtil-VxkkbMZK7nXEShlrD9trRJ1VvM2nmQg7KnIN17Y_J9GHt2ZzbEc40i8R8U94duRG9IM7Gj1Q/pub?output=csv";

const url = process.env.GOOGLE_SHEET_CSV_URL || DEFAULT_CSV;

const res = await fetch(url);
if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
const text = await res.text();
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "products.csv"), text, "utf8");
console.log("Wrote site/data/products.csv");
