/** @param {string} s */
export function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

/** @param {string} tag @param {string} className @param {Record<string,string>} [attrs] @param {string} [html] */
export function el(tag, className, attrs = {}, html = "") {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (
      k === "href" ||
      k === "src" ||
      k === "alt" ||
      k === "type" ||
      k === "name" ||
      k === "value" ||
      k === "placeholder" ||
      k === "rows" ||
      k === "id" ||
      k === "for" ||
      k === "action" ||
      k === "method" ||
      k === "target" ||
      k === "rel" ||
      k === "autocomplete" ||
      k === "fetchpriority"
    ) {
      n.setAttribute(k, v);
    } else if (k.startsWith("data-")) n.setAttribute(k, v);
    else if (k === "required") {
      if (v) n.setAttribute("required", "");
    }
  });
  if (html) n.innerHTML = html;
  return n;
}
