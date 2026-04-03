/** @param {number} value */
export function formatBynPrice(value) {
  const rounded = Number.isFinite(value) ? value : 0;
  const formatted = rounded.toLocaleString("ru-BY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} BYN`;
}
