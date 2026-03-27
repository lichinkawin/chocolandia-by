const FALLBACK_IMAGE_NAME = "placeholder.jpg";

export function normalizeImageFileName(input?: string): string {
  if (!input) {
    return FALLBACK_IMAGE_NAME;
  }

  const trimmed = input.trim().toLowerCase();
  if (!trimmed) {
    return FALLBACK_IMAGE_NAME;
  }

  const unified = trimmed.replaceAll("\\", "/");
  const nameOnly = (unified.split("/").pop() ?? unified).trim();
  if (!nameOnly) return FALLBACK_IMAGE_NAME;
  return nameOnly;
}

export function toPublicImagePath(input?: string): string {
  const fileName = normalizeImageFileName(input).replace(/^\/+/, "");
  if (fileName.startsWith("new/")) {
    return `/NEW/${fileName.slice(4)}`;
  }
  if (fileName.startsWith("NEW/")) {
    return `/NEW/${fileName.slice(4)}`;
  }
  return `/NEW/${fileName}`;
}
