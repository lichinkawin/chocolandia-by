"use client";

import { FormEvent, useMemo, useState } from "react";
import { formatBynPrice } from "@/lib/price";
import { useCart } from "@/store/useCart";

type CheckoutResponse = {
  ok: boolean;
  error?: string;
};

export function CheckoutForm() {
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+375");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );

  const isPhoneValid = /^\+375\d{9}$/.test(phone);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      setStatusType("error");
      setStatusMessage("Корзина пуста. Добавьте товары перед оформлением.");
      return;
    }

    if (!isPhoneValid) {
      setStatusType("error");
      setStatusMessage("Введите номер в формате +375XXXXXXXXX.");
      return;
    }

    setIsSubmitting(true);
    setStatusType("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, address, comment },
          items,
          total,
        }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось отправить заказ.");
      }

      clearCart();
      setName("");
      setPhone("+375");
      setAddress("");
      setComment("");
      setStatusType("success");
      setStatusMessage("Заказ отправлен! Мы скоро свяжемся с вами.");
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Ошибка отправки заказа.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-foreground/80">Имя</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-accent"
          placeholder="Анна"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-foreground/80">Телефон (+375...)</span>
        <input
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/\s+/g, ""))}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-accent"
          placeholder="+375291112233"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
        <span className="text-foreground/80">Адрес доставки</span>
        <input
          required
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-accent"
          placeholder="г. Минск, ул. Примерная, 10-12"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
        <span className="text-foreground/80">Комментарий</span>
        <textarea
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-accent"
          placeholder="Удобное время доставки, пожелания по упаковке..."
        />
      </label>

      <div className="sm:col-span-2 flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-4">
        <p className="text-sm text-foreground/80">Товаров в корзине: {items.length}</p>
        <p className="text-sm text-foreground/80">
          Сумма заказа: <strong>{formatBynPrice(total)}</strong>
        </p>

        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
        >
          {isSubmitting ? "Отправка..." : "Отправить заказ в Telegram"}
        </button>

        {statusMessage ? (
          <p
            className={`text-sm ${
              statusType === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
