const FALLBACK_IMAGE_NAME = "placeholder.jpg";

/** @param {string | undefined} input */
export function normalizeImageFileName(input) {
  if (!input) return FALLBACK_IMAGE_NAME;
  const unified = String(input).trim().replaceAll("\\", "/");
  const nameOnly = (unified.split("/").pop() ?? unified).trim();
  if (!nameOnly) return FALLBACK_IMAGE_NAME;
  return nameOnly;
}

/** @param {string | undefined} input */
export function toPublicImagePath(input) {
  const fileName = normalizeImageFileName(input).replace(/^\/+/, "");
  if (fileName.startsWith("new/")) return `NEW/${fileName.slice(4)}`;
  if (fileName.startsWith("NEW/")) return `NEW/${fileName.slice(4)}`;
  return `NEW/${fileName}`;
}

/** @param {string | undefined} value */
export function toFinalImagePath(value) {
  const normalized = toPublicImagePath(value);
  const parts = normalized.split("/");
  const fileName = parts.at(-1) ?? "placeholder.jpg";
  return `NEW/${fileName}`;
}
