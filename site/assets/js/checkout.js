import { getConfig } from "./config.js";
import { clearCart, getCartItems } from "./cart.js";
import { formatBynPrice } from "./price.js";

function buildOrderMessage(customer, items, total) {
  const lines = items.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    return `${index + 1}. ${item.name} x ${item.quantity} = ${formatBynPrice(itemTotal)}`;
  });
  return [
    "Новый заказ Chocolandia.by",
    "",
    "Клиент:",
    `Имя: ${customer.name}`,
    `Телефон: ${customer.phone}`,
    `Адрес: ${customer.address}`,
    `Комментарий: ${customer.comment || "—"}`,
    "",
    "Состав:",
    ...lines,
    "",
    `Итого: ${formatBynPrice(total)}`,
  ].join("\n");
}

/**
 * @param {HTMLFormElement} form
 * @param {{ onStatus: (type: 'idle'|'success'|'error', msg: string) => void }} hooks
 */
export function initCheckoutForm(form, hooks) {
  const statusEl = document.getElementById("checkout-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { formspreeUrl } = getConfig();
    if (!formspreeUrl || formspreeUrl.includes("REPLACE_ME")) {
      hooks.onStatus(
        "error",
        "Укажите formspreeUrl в window.__CHOCOLANDIA_CONFIG__ на странице (или в index.html).",
      );
      return;
    }

    const items = getCartItems();
    const name = /** @type {HTMLInputElement} */ (form.elements.namedItem("name")).value.trim();
    const phone = /** @type {HTMLInputElement} */ (form.elements.namedItem("phone")).value.replace(/\s+/g, "");
    const address = /** @type {HTMLInputElement} */ (form.elements.namedItem("address")).value.trim();
    const comment = /** @type {HTMLTextAreaElement} */ (form.elements.namedItem("comment")).value.trim();

    if (!items.length) {
      hooks.onStatus("error", "Корзина пуста. Добавьте товары перед оформлением.");
      return;
    }
    if (!name || !phone || !address) {
      hooks.onStatus("error", "Заполните имя, телефон и адрес.");
      return;
    }
    if (!/^\+375\d{9}$/.test(phone)) {
      hooks.onStatus("error", "Введите номер в формате +375XXXXXXXXX.");
      return;
    }

    const total = items.reduce((a, i) => a + i.price * i.quantity, 0);
    const message = buildOrderMessage({ name, phone, address, comment }, items, total);

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    hooks.onStatus("idle", "");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("phone", phone);
    fd.append("address", address);
    fd.append("comment", comment);
    fd.append("message", message);
    fd.append("_subject", `Заказ Chocolandia.by — ${formatBynPrice(total)}`);

    try {
      const res = await fetch(formspreeUrl, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        clearCart();
        form.reset();
        /** @type {HTMLInputElement} */ (form.elements.namedItem("phone")).value = "+375";
        hooks.onStatus("success", "Заказ отправлен! Мы скоро свяжемся с вами.");
      } else {
        hooks.onStatus(
          "error",
          data.error || `Ошибка отправки (${res.status}).`,
        );
      }
    } catch {
      hooks.onStatus("error", "Не удалось отправить заказ. Проверьте сеть.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
