import * as icons from "../icons.js";
import { initCheckoutForm } from "../checkout.js";
import {
  getCartItems,
  onCartChange,
  removeItem,
  updateQuantity,
} from "../cart.js";
import { initLayout } from "../layout.js";
import { el } from "../dom.js";
import { formatBynPrice } from "../price.js";

function renderCartList(container) {
  container.innerHTML = "";
  const items = getCartItems();
  if (!items.length) {
    container.appendChild(
      el(
        "p",
        "py-12 text-center text-sm text-foreground-muted",
        {},
        "Корзина пока пуста.",
      ),
    );
    return;
  }
  items.forEach((item) => {
    const art = el(
      "article",
      "flex items-start gap-4 rounded-xl border border-outline-variant/30 bg-muted-low/50 p-4",
    );
    const imgBox = el(
      "div",
      "relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-muted",
    );
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.name;
    img.className = "h-full w-full object-cover";
    img.onerror = () => {
      img.style.display = "none";
    };
    imgBox.appendChild(img);

    const body = el("div", "min-w-0 flex-1 space-y-2");
    body.appendChild(
      el("h3", "font-serif text-base text-primary-cocoa", {}, item.name),
    );
    body.appendChild(
      el("p", "text-sm text-foreground-muted", {}, formatBynPrice(item.price)),
    );
    const row = el("div", "flex items-center justify-between gap-3");
    const stepper = el(
      "div",
      "inline-flex items-center rounded-md border border-outline-variant/50 bg-card",
    );
    const b1 = el(
      "button",
      "p-2 transition hover:bg-muted",
      { type: "button" },
      icons.iconMinus(),
    );
    b1.addEventListener("click", () =>
      updateQuantity(item.id, item.quantity - 1),
    );
    const count = el(
      "span",
      "min-w-8 text-center text-sm font-medium",
      {},
      String(item.quantity),
    );
    const b2 = el(
      "button",
      "p-2 transition hover:bg-muted",
      { type: "button" },
      icons.iconPlus(),
    );
    b2.addEventListener("click", () =>
      updateQuantity(item.id, item.quantity + 1),
    );
    stepper.appendChild(b1);
    stepper.appendChild(count);
    stepper.appendChild(b2);
    const del = el(
      "button",
      "rounded-md p-2 text-foreground-muted transition hover:bg-muted hover:text-foreground",
      { type: "button" },
      icons.iconTrash(),
    );
    del.addEventListener("click", () => removeItem(item.id));
    row.appendChild(stepper);
    row.appendChild(del);
    body.appendChild(row);
    art.appendChild(imgBox);
    art.appendChild(body);
    container.appendChild(art);
  });
}

function subtotal() {
  return getCartItems().reduce((a, i) => a + i.price * i.quantity, 0);
}

function main() {
  initLayout();
  const list = document.getElementById("cart-list-root");
  const subEl = document.getElementById("cart-subtotal");
  const form = document.getElementById("checkout-form");

  const refresh = () => {
    if (list) renderCartList(list);
    if (subEl) subEl.textContent = formatBynPrice(subtotal());
  };
  refresh();
  onCartChange(refresh);

  if (form instanceof HTMLFormElement) {
    initCheckoutForm(form, {
      onStatus(type, msg) {
        const elStatus = document.getElementById("checkout-status");
        if (!elStatus) return;
        elStatus.textContent = msg;
        elStatus.className =
          type === "success"
            ? "text-sm text-green-700"
            : type === "error"
              ? "text-sm text-red-700"
              : "text-sm";
      },
    });
  }
}

main();
