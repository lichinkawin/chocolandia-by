/**
 * @typedef {Object} ChocolandiaConfig
 * @property {string} [formspreeUrl] Formspree endpoint, e.g. https://formspree.io/f/xxxx
 * @property {string} [productsCsvUrl]
 * @property {string} [productsBundledUrl] Same-origin CSV (e.g. data/products.csv) if Google CORS blocks
 * @property {string} [homeSettingsCsvUrl]
 * @property {string} [homeCategoriesCsvUrl]
 */

/** @returns {ChocolandiaConfig} */
export function getConfig() {
  const w = typeof window !== "undefined" ? window : {};
  const extra = w.__CHOCOLANDIA_CONFIG__ || {};
  return {
    formspreeUrl: extra.formspreeUrl || "",
    productsCsvUrl: extra.productsCsvUrl,
    productsBundledUrl: extra.productsBundledUrl,
    homeSettingsCsvUrl: extra.homeSettingsCsvUrl,
    homeCategoriesCsvUrl: extra.homeCategoriesCsvUrl,
  };
}
