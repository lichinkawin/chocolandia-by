/** @param {string} s */
export function safeDecodeURIComponent(s) {
  let out = String(s).replace(/\+/g, " ");
  try {
    out = decodeURIComponent(out);
  } catch {
    /* keep */
  }
  return out;
}

/**
 * Порядок: путь `/collections/...` (Apache), hash `#col=...` (serve / clean URLs),
 * затем `?slug=` / `?category=`.
 * @returns {string}
 */
export function getCollectionSlugFromUrl() {
  const u = new URL(window.location.href);
  const path = u.pathname.replace(/\/+$/, "") || "";
  const marker = "/collections/";
  const idx = path.lastIndexOf(marker);
  let result = "";
  if (idx !== -1) {
    const rest = path.slice(idx + marker.length);
    const seg = rest.split("/").filter(Boolean)[0];
    if (seg) result = safeDecodeURIComponent(seg);
  }
  if (!result && u.hash.length > 1) {
    const params = new URLSearchParams(u.hash.slice(1));
    const col = params.get("col");
    if (col != null && String(col).trim() !== "") {
      result = safeDecodeURIComponent(String(col).trim());
    }
  }
  if (!result) {
    const q =
      u.searchParams.get("slug") ||
      u.searchParams.get("collection") ||
      u.searchParams.get("category");
    if (q != null && String(q).trim() !== "") {
      result = safeDecodeURIComponent(String(q).trim());
    }
  }
  return result;
}

/** @param {string} filterKey */
export function collectionPathForFilterKey(filterKey) {
  return `catalog.html#col=${encodeURIComponent(filterKey)}`;
}

/**
 * @param {string} rawSlug
 * @param {{ filter_key: string, collection_slug?: string, category_name?: string }[]} categories
 * @returns {string | null} filter_key или null
 */
export function resolveCollectionFilterKey(rawSlug, categories) {
  const decoded = String(rawSlug).trim();
  if (!decoded) return null;
  if (decoded.toLowerCase() === "все") return null;

  for (const c of categories) {
    if (c.filter_key === decoded) return c.filter_key;
  }
  const lower = decoded.toLowerCase();
  for (const c of categories) {
    if (c.filter_key.toLowerCase() === lower) return c.filter_key;
  }
  for (const c of categories) {
    const slug = (c.collection_slug || "").trim().toLowerCase();
    if (slug && slug === lower) return c.filter_key;
  }
  return null;
}
