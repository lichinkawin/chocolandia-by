const STORAGE_KEY = "chocolandia-cart";

/** @typedef {{ id: string, code: string, name: string, price: number, category: string, imageUrl: string, slug: string, quantity: number }} CartItem */

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (parsed.state?.items) return { items: parsed.state.items };
    if (Array.isArray(parsed.items)) return { items: parsed.items };
    return { items: [] };
  } catch {
    return { items: [] };
  }
}

function writeItems(items) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ state: { items }, version: 0 }),
  );
  window.dispatchEvent(new CustomEvent("chocolandia-cart"));
}

/** @returns {CartItem[]} */
export function getCartItems() {
  return readRaw().items;
}

/** @param {CartItem[]} items */
export function setCartItems(items) {
  writeItems(items);
}

/**
 * @param {Omit<CartItem, "quantity"> & { quantity?: number }} item
 */
export function addItem(item) {
  const items = getCartItems();
  const existing = items.find((i) => i.id === item.id);
  const q = item.quantity ?? 1;
  if (existing) {
    const next = items.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + q } : i,
    );
    setCartItems(next);
    return;
  }
  setCartItems([...items, { ...item, quantity: q }]);
}

/** @param {string} id */
export function removeItem(id) {
  setCartItems(getCartItems().filter((i) => i.id !== id));
}

/** @param {string} id @param {number} quantity */
export function updateQuantity(id, quantity) {
  if (quantity <= 0) {
    removeItem(id);
    return;
  }
  setCartItems(
    getCartItems().map((i) => (i.id === id ? { ...i, quantity } : i)),
  );
}

export function clearCart() {
  setCartItems([]);
}

export function cartItemsCount() {
  return getCartItems().reduce((a, i) => a + i.quantity, 0);
}

/** @param {() => void} fn @returns {() => void} */
export function onCartChange(fn) {
  const w = () => fn();
  window.addEventListener("chocolandia-cart", w);
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) fn();
  });
  return () => window.removeEventListener("chocolandia-cart", w);
}
